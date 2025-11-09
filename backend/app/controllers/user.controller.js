const db = require("../models");
const User = db.User;
const UserFinance = db.UserFinance;
const UserPreferences = db.UserPreferences;
const UserBookmark = db.UserBookmark;
const Vehicle = db.Vehicle;

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.body.id }
        });

        if (!user){
            return res.status(404).send({ message: "User not found" });
        }

        res.send({
            user: {
                email: user.email,
                refreshToken: user.refreshToken
            } 
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.setEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.body.id }
        });
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        const email = req.body.email;
        
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        await user.update({ email });
        
        res.send({ message: "Email updated successfully", email });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.setUserPreferences = async (req, res) => {
    try {
        const { budget, carType, purchaseType } = req.body;
        const userId = req.id;

        const [preferences, created] = await UserPreferences.findOrCreate({
            where: { userId },
            defaults: { budget, carType, purchaseType }
        });

        if (!created) {
            await preferences.update({ budget, carType, purchaseType });
        }

        res.send({ message: "Preferences saved successfully", preferences });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getUserPreferences = async (req, res) => {
    try {
        const userPreferences = await UserPreferences.findOne({
            where: { userId: req.body.id }
        });

        if (!userPreferences){
            return res.status(404).send({ message: "User preferences not found" });
        }

        res.send({
            UserPreferences: {
                userId: userPreferences.userId,
                budget: userPreferences.budget,
                carType: userPreferences.carType,
                purchaseType: userPreferences.purchaseType
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.setUserFinances = async (req, res) => {
    try {
        const creditTier = req.body.creditTier;
        const userId = req.id;
        const [finances, created] = await UserFinance.findOrCreate({
            where: { userId },
            defaults: { creditTier }
        });

        if (!created) {
            await finances.update({ creditTier });
        }

        res.send({ message: "User finances saved successfully", finances });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getUserFinances = async (req, res) => {
    try {
        const userId = req.id;
        const userFinance = await UserFinance.findOne({
            where: { userId: userId }
        });

        if(!userFinance){
            return res.status(404).send({ message: "User finances not found" });
        }

        res.send({
            UserFinance: {
                creditTier: userFinance.creditTier
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.addBookmark = async (req, res) => {
    try {
        const userId = req.body.userId;
        const vehicleId = req.params.vehicleId;

        const [bookmark, created] = await UserBookmark.findOrCreate({
            where: {
                userId,
                vehicleId
            },
            defaults: {
                userId,
                vehicleId
            }
        });

        if (created) {
            return res.status(201).send({
                message: "Bookmark added successfully",
                bookmark
            });
        } else {
            return res.status(200).send({
                message: "Bookmark already exists",
                bookmark
            });
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.removeBookmark = async (req, res) => {
    try {
        const userId = req.body.userId;
        const vehicleId = req.params.vehicleId;

        const deleted = await UserBookmark.destroy({
            where: {
                userId,
                vehicleId
            }
        });

        if (!deleted) {
            return res.status(404).send({ message: "Bookmark not found" });
        }

        res.send({ message: "Bookmark removed successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.completeOnboarding = async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.update(
            { completedOnboarding: true },
            { where: { id: userId } }
        );

        res.send({ message: "Onboarding completed successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};