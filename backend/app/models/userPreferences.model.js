module.exports = (sequelize, DataTypes) => {
  const UserPreferences = sequelize.define("UserPreferences", {
    budget: DataTypes.FLOAT,
    carType: DataTypes.STRING,
    fuelType: DataTypes.STRING,
  });

  UserPreferences.associate = (models) => {
    UserPreferences.belongsTo(models.User, { foreignKey: "userId" });
  };

  return UserPreferences;
};