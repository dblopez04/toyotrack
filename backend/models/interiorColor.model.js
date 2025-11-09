module.exports = (sequelize, DataTypes) => {
  const InteriorColor = sequelize.define("InteriorColor", {
    colorSchemeName: DataTypes.STRING,
    rgbValue: DataTypes.STRING
  });

  InteriorColor.associate = (models) => {
    InteriorColor.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return InteriorColor;
};