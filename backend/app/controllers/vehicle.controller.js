const db = require("../models");
const { Op } = require("sequelize");
const Vehicle = db.Vehicle;
const InteriorColor = db.InteriorColor;
const ExteriorColor = db.ExteriorColor;
const ExtraFeature = db.ExtraFeature;
const CarImage = db.CarImage;


exports.getAllVehicles = async (req, res) => {
  try {
    const where = {};

    if (req.query.minPrice || req.query.maxPrice) {
      where.baseMsrp = {};
      if (req.query.minPrice) where.baseMsrp[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) where.baseMsrp[Op.lte] = parseFloat(req.query.maxPrice);
    }

    if (req.query.electric === 'true') where.electric = true;
    if (req.query.electric === 'false') where.electric = false;
    if (req.query.truck === 'true') where.truck = true;
    if (req.query.truck === 'false') where.truck = false;
    if (req.query.pluginElectric === 'true') where.pluginElectric = true;
    if (req.query.pluginElectric === 'false') where.pluginElectric = false;

    if (req.query.search) {
      where.model = { [Op.iLike]: `%${req.query.search}%` };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { count, rows } = await Vehicle.findAndCountAll({
      where: where,
      include: [{ model: CarImage, as: 'CarImages' }],
      limit: limit,
      offset: offset,
      order: [['baseMsrp', 'ASC']]
    });

    res.json({
      vehicles: rows,
      total: count,
      page: page,
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicleDetails = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            where: { id: req.params.id },
            include: [
                { model: InteriorColor, as: 'InteriorColors' },
                { model: ExteriorColor, as: 'ExteriorColors' },
                { model: ExtraFeature, as: 'ExtraFeatures' },  
                { model: CarImage, as: 'CarImages' },              
            ]
        });
        
        if(!vehicle){
            return res.status(404).send({ message: "Vehicle not found" });
        }

        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getExteriorColorByID = async (req, res) => {
    try {
        const exteriorColors = await ExteriorColor.findOne({
            where: { vehicleId: req.params.id }
        });

        res.json(exteriorColors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getInteriorColorByID = async (req, res) => {
    try {
        const interiorColors = await InteriorColor.findOne({
            where: { vehicleId: req.params.id }
        });

        res.json(interiorColors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getFeaturesByID = async (req, res) => {
    try {
        const where = { vehicleId: req.params.id };

        // Optional category filter from query params
        if (req.query.category) {
            where.category = req.query.category;
        }

        const features = await ExtraFeature.findAll({ where });
        res.json(features);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoriesByID = async (req, res) => {
    try {
        const categories = await ExtraFeature.findAll({
            where: { vehicleId: req.params.id },
            attributes: ['category'],
            group: ['category'],
            raw: true
        });

        const categoryList = categories.map(c => c.category)

        res.json({ 
            categories: categoryList 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getImagesByID = async (req, res) => {
    try {
        const images = await CarImage.findAll({
            where: { vehicleId: req.params.id }
        });
        res.json({ images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getFirstImageByID = async (req, res) => {
    try {
        const image = await CarImage.findOne({
            where: { vehicleId: req.params.id }
        });
        res.json({ image });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.compareTwoVehiclesByID = async (req, res) => {
    try {
        const { id1, id2 } = req.body;

        const vehicle1 = await Vehicle.findOne({
            where: { id: id1 },
            include: [
                    { model: InteriorColor, as: 'InteriorColors' },
                    { model: ExteriorColor, as: 'ExteriorColors' },
                    { model: ExtraFeature, as: 'ExtraFeatures' },
                    { model: CarImage, as: 'CarImages' },
                ]
        });
        const vehicle2 = await Vehicle.findOne({
            where: { id: id2 },
            include: [
                    { model: InteriorColor, as: 'InteriorColors' },
                    { model: ExteriorColor, as: 'ExteriorColors' },
                    { model: ExtraFeature, as: 'ExtraFeatures' },
                    { model: CarImage, as: 'CarImages' },
            ]
        });

        if(!vehicle1){
            return res.status(404).json({ message: "First vehicle not found" })
        }

        if(!vehicle2){
            return res.status(404).json({ message: "Second vehicle not found" })
        }

        const priceDifference = vehicle1.baseMsrp - vehicle2.baseMsrp;
        const cheaperVehicle = priceDifference < 0 ? vehicle1.model : vehicle2.model;
        
        res.json({
            vehicle1: vehicle1,
            vehicle2: vehicle2,
            comparison: {
                priceDifference: Math.abs(priceDifference),
                cheaperVehicle: cheaperVehicle,
                bothElectric: vehicle1.electric && vehicle2.electric,
                bothTrucks: vehicle1.truck && vehicle2.truck,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

