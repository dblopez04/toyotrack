const express = require('express');
const router = new express.Router();
const controller = require('../controllers/user.controller');
const middleware = require('../middleware/auth.middleware');

router.use(middleware.verifyToken);

router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.put("/email", controller.setEmail);
router.get("/preferences", controller.getUserPreferences);
router.post("/preferences", controller.setUserPreferences);
router.get("/finances", controller.getUserFinances);
router.post("/finances", controller.setUserFinances);
router.get("/bookmarks", controller.getBookmarks);
router.post("/bookmarks/:vehicleId", controller.addBookmark);
router.delete("/bookmarks/:vehicleId", controller.removeBookmark);
router.post("/onboarding/complete", controller.completeOnboarding);

module.exports = router;