module.exports = (sequelize, DataTypes) => {
  const UserBookmark = sequelize.define("UserBookmark", {
    
  });

  UserBookmark.associate = (models) => {
    UserBookmark.belongsTo(models.User, { foreignKey: "userId" });
    UserBookmark.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return UserBookmark;
};
