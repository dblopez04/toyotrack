module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    accessToken: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasOne(models.UserPreferences, { foreignKey: "userId" });
    User.hasOne(models.UserFinance, { foreignKey: "userId" });
  };

  return User;
};
