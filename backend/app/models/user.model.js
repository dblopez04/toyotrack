module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasOne(models.UserPreferences, { foreignKey: "userId" });
    User.hasOne(models.UserFinance, { foreignKey: "userId" });
    User.hasMany(models.UserBookmark, { foreignKey: "userId" });
    User.hasMany(models.VehicleQuote, { foreignKey: "userId" });
  };

  return User;
};
