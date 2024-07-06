module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define("Organisation", {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  });
  Organisation.associate = (models) => {
    Organisation.belongsToMany(models.User, {
      through: "UserOrganisation",
      foreignKey: "orgId",
      as: "users",
    });
  };
  // Organisation.associate = (models) => {
  //   Organisation.hasMany(models.User, { foreignKey: "userId", as: "users" });
  // };
  return Organisation;
};
