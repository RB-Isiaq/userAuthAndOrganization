require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const indexRoutes = require("./routes");
const authRoutes = require("./routes/auth");
const organisationRoutes = require("./routes/organisation");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organisations", organisationRoutes);

const isTestEnv = process.env.NODE_ENV === "test";
const PORT = isTestEnv ? 9000 : process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
