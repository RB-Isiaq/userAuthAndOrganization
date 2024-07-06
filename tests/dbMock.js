const sinon = require("sinon");
const { Sequelize, DataTypes } = require("sequelize");
const proxyquire = require("proxyquire");

// Create a mock Sequelize instance
const sequelizeMock = new Sequelize("postgres::memory:", { logging: false });

// Define mock models
const User = sequelizeMock.define("User", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  phone: DataTypes.STRING,
});

const Organisation = sequelizeMock.define("Organisation", {
  orgId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

// Mock relationships if any
User.belongsToMany(Organisation, { through: "UserOrganisation" });
Organisation.belongsToMany(User, { through: "UserOrganisation" });

// Stub out the models to return the mock models
const dbStub = {
  sequelize: sequelizeMock,
  Sequelize,
  models: {
    User,
    Organisation,
  },
};

module.exports = dbStub;
