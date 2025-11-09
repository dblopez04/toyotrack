const { sequelize, Sequelize } = require("../config/db.config");

const Vehicle = require("./vehicle.model")(sequelize, Sequelize.DataTypes);
const ExteriorColor = require("./exteriorColor.model")(sequelize, Sequelize.DataTypes);
const InteriorColor = require("./interiorColor.model")(sequelize, Sequelize.DataTypes);
const ExtraFeature = require("./extraFeature.model")(sequelize, Sequelize.DataTypes);
const CarImage = require("./carImage.model")(sequelize, Sequelize.DataTypes);
const User = require("./user.model")(sequelize, Sequelize.DataTypes);
const UserPreferences = require("./userPreferences.model")(sequelize, Sequelize.DataTypes);
const UserFinance = require("./userFinance.model")(sequelize, Sequelize.DataTypes);
const UserBookmark = require("./userBookmark.model")(sequelize, Sequelize.DataTypes);
const VehicleQuote = require("./vehicleQuote.model")(sequelize, Sequelize.DataTypes);

const db = {
  Vehicle,
  ExteriorColor,
  InteriorColor,
  ExtraFeature,
  CarImage,
  User,
  UserPreferences,
  UserFinance,
  UserBookmark,
  VehicleQuote,
  sequelize,
  Sequelize
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;