const { sequelize, Sequelize } = require("../config/db.config");

const Vehicle = require("./vehicle.model")(sequelize, Sequelize.DataTypes);
const ExteriorColor = require("./exteriorColor.model")(sequelize, Sequelize.DataTypes);
const InteriorColor = require("./interiorColor.model")(sequelize, Sequelize.DataTypes);
const ExtraFeature = require("./extraFeature.model")(sequelize, Sequelize.DataTypes);
const CarImage = require("./carImage.model")(sequelize, Sequelize.DataTypes);

const db = {
  Vehicle,
  ExteriorColor,
  InteriorColor,
  ExtraFeature,
  CarImage,
  sequelize,
  Sequelize
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;