const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Organisation = require("./organisation");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User(sequelize, Sequelize);
db.Organisation = Organisation(sequelize, Sequelize);

db.User.belongsToMany(db.Organisation, { through: "userOrganisations" });
db.Organisation.belongsToMany(db.User, { through: "userOrganisations" });

module.exports = db;
