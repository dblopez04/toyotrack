const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_COOKIE = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000 // 15 minutes
};

const REFRESH_TOKEN_COOKIE = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { user_id: user.id },
        JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { user_id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await user.update({ refreshToken: refreshToken });

        res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE);
        res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE);

        res.status(201).send({
            message: "User registered successfully!",
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await user.update({ refreshToken: refreshToken });

        res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE);
        res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE);

        res.status(200).send({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error logging in" });
    }
};


exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const user = await User.findOne({
            where: {
                id: decoded.user_id,
                refreshToken: refreshToken
        }
        });

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);

        res.cookie('accessToken', newAccessToken, ACCESS_TOKEN_COOKIE);
        res.status(200).json({ message: "Token refreshed successfully" });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await User.update(
                { refreshToken: null },
                { where: { refreshToken: refreshToken } }
            );
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};