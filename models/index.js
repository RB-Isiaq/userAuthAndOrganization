const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Organization = require("./organization");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User(sequelize, Sequelize);
db.Organization = Organization(sequelize, Sequelize);

db.User.belongsToMany(db.Organization, { through: "UserOrganizations" });
db.Organization.belongsToMany(db.User, { through: "UserOrganizations" });

db.sequelize.sync();
module.exports = db;
