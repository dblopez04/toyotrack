module.exports = (sequelize, DataTypes) => {
  const VehicleQuote = sequelize.define("VehicleQuote", {
    termLengthMonths: DataTypes.INTEGER,
    apr: DataTypes.FLOAT,
    downPayment: DataTypes.FLOAT,
    estimatedPayment: DataTypes.FLOAT
  });

  VehicleQuote.associate = (models) => {
    VehicleQuote.belongsTo(models.User, { foreignKey: "userId" });
    VehicleQuote.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return VehicleQuote;
};
