module.exports = (sequelize, DataTypes) => {
  const ExtraFeature = sequelize.define("ExtraFeature", {
    category: DataTypes.STRING,
    featureName: DataTypes.STRING,
    featureDescription: DataTypes.STRING,
    optional: DataTypes.BOOLEAN
  });

  ExtraFeature.associate = (models) => {
    ExtraFeature.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return ExtraFeature;
};