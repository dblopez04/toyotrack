module.exports = (sequelize, DataTypes) => {
  const UserFinance = sequelize.define("UserFinance", {
    creditTier: DataTypes.STRING,
    termLengthMonths: DataTypes.INTEGER,
    apr: DataTypes.FLOAT,
    downPayment: DataTypes.FLOAT,
    estimatedPayment: DataTypes.FLOAT
  });

  UserFinance.associate = (models) => {
    UserFinance.belongsTo(models.User, { foreignKey: "userId" });
  };

  return UserFinance;
};
