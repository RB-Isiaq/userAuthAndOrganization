require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const organizationRoutes = require("./routes/organization");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);

const PORT = process.env.PORT || 5000;

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
