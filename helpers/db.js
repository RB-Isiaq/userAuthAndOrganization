const mongoose = require("mongoose");
const config = require("../config.json");

// const connectionOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

try {
  mongoose
    .connect(process.env.MONGOO_URI || config.connectionString)
    .then((res) => console.log("MongoDB connection established!"));
} catch (e) {
  console.log("MongoDB connection error: " + e.message);
  process.exit();
}

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/user"),
};
