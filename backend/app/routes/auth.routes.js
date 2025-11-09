const express = require('express');
const router = new express.Router();
const controller = require('../controllers/auth.controller');
const middleware = require('../middleware/auth.middleware');

router.post("/register", middleware.duplicateRegistration, controller.register);
router.post("/login", controller.login);
router.post("/logout", middleware.verifyToken, controller.logout);
router.post("/refresh", controller.refresh);

module.exports = router;