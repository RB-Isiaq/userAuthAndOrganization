// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const sequelize = require("./config/db");
// const authRoutes = require("./routes/auth");
// const organisationRoutes = require("./routes/organisation");
// const userRoutes = require("./routes/user");
// const pool = require("./config/connection");

// const app = express();

// app.use(bodyParser.json());
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// app.use("/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/organisations", organisationRoutes);

// const PORT = process.env.PORT || 5000;
// app.get("/", (req, res) => {
//   pool.query("SELECT NOW()", (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.send(`Database time: ${results.rows[0].now}`);
//   });
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // sequelize
// //   .sync()
// //   .then(() => {
// //     console.log("Database connected!");
// //     app.listen(PORT, () => {
// //       console.log(`Server is running on port: ${PORT}`);
// //     });
// //   })
// //   .catch((err) => console.log(err));

// module.exports = app;

// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const organisationRoutes = require("./routes/organisation");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organisations", organisationRoutes);

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
