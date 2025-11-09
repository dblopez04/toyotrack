module.exports = (sequelize, DataTypes) => {
  const ExteriorColor = sequelize.define("ExteriorColor", {
    colorSchemeName: DataTypes.STRING,
    rgbValue: DataTypes.STRING
  });

  ExteriorColor.associate = (models) => {
    ExteriorColor.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return ExteriorColor;
};