module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define("Organization", {
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
  //   Organization.associate = (models) => {
  //     Organization.belongsToMany(models.User, {
  //       through: "UserOrganization",
  //       foreignKey: "orgId",
  //       as: "users",
  //     });
  //   };
  Organization.associate = (models) => {
    Organization.hasMany(models.User, { foreignKey: "userId", as: "users" });
  };
  return Organization;
};
