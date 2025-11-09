const express = require('express');
const router = new express.Router();
const controller = require('../controllers/vehicle.controller');

router.post("/", controller.getAllVehicles);
router.post("/compare", controller.compareTwoVehiclesByID);
router.post("/:id", controller.getVehicleDetails);
router.post("/:id/exterior-colors", controller.getExteriorColorByID);
router.post("/:id/interior-colors", controller.getInteriorColorByID);
router.post("/:id/features", controller.getFeaturesByID);
router.post("/:id/categories", controller.getCategoriesByID);
router.post("/:id/images", controller.getImagesByID);
router.post("/:id/first-image", controller.getFirstImageByID);

module.exports = router;