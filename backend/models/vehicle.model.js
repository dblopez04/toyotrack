module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define("Vehicle", {
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    trimName: DataTypes.STRING,
    baseMsrp: DataTypes.FLOAT,
    baseInvoice: DataTypes.FLOAT,
    truck: DataTypes.BOOLEAN,
    electric: DataTypes.BOOLEAN,
    pluginElectric: DataTypes.BOOLEAN,
  });

  Vehicle.associate = (models) => {
    Vehicle.hasMany(models.ExteriorColor, { foreignKey: "vehicleId" });
    Vehicle.hasMany(models.InteriorColor, { foreignKey: "vehicleId" });
    Vehicle.hasMany(models.ExtraFeature, { foreignKey: "vehicleId" });
    Vehicle.hasMany(models.CarImage, { foreignKey: "vehicleId" });
  };

  return Vehicle;
};