const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    try {
        let token = req.cookies.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).send({ message: "No access token provided" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Invalid access token" });
            }

            req.id = decoded.user_id;
            req.user_id = decoded.user_id;
            next();
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error verifying token" });
    }
};

exports.duplicateRegistration = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOne({
            where: { email: email }
        });

        if (user) {
            return res.status(400).send({
                message: "Email already in use"
            });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error checking registration" });
    }
};