require("dotenv").config();
const pg = require("pg");
const { Sequelize } = require("sequelize");

const isTestEnv = process.env.NODE_ENV === "test";

const options = isTestEnv
  ? {
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    }
  : process.env.DEV_ENV
  ? {
      database: process.env.LOCAL_DB_NAME,
      username: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      host: "localhost",
      dialect: "postgres",
      dialectModule: pg,
    }
  : {
      dialect: "postgres",
      dialectModule: pg,
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
