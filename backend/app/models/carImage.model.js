module.exports = (sequelize, DataTypes) => {
  const CarImage = sequelize.define("CarImage", {
    imageHeight: DataTypes.INTEGER,
    imageWidth: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  });

  CarImage.associate = (models) => {
    CarImage.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return CarImage;
};
