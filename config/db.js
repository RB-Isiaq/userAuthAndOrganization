// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "postgres",
//   }
// );

// module.exports = sequelize;

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.PORT,
// });

// pool.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database", err);
//   } else {
//     console.log("Connected to the database");
//   }
// });

// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const options = {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
};

const sequelize = new Sequelize(options);

module.exports = sequelize;
