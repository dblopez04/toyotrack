const express = require('express');
const router = new express.Router();
const controller = require('../controllers/vehicle.controller');

router.get("/", controller.getAllVehicles);
router.post("/compare", controller.compareTwoVehiclesByID);
router.get("/:id", controller.getVehicleDetails);
router.get("/:id/exterior-colors", controller.getExteriorColorByID);
router.get("/:id/interior-colors", controller.getInteriorColorByID);
router.get("/:id/features", controller.getFeaturesByID);
router.get("/:id/categories", controller.getCategoriesByID);
router.get("/:id/images", controller.getImagesByID);
router.get("/:id/first-image", controller.getFirstImageByID);

module.exports = router;