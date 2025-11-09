module.exports = (sequelize, DataTypes) => {
  const UserFinance = sequelize.define("UserFinance", {
    creditTier: DataTypes.STRING
  });

  UserFinance.associate = (models) => {
    UserFinance.belongsTo(models.User, { foreignKey: "userId" });
  };

  return UserFinance;
};
