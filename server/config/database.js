const mongoose = require("mongoose");
require("dotenv").config();

const DB_NAME = "LIbrary_Managment"; // Database name
URI  = process.env.MONGO_URI;
const connectMongoDB = async () => {

  mongoose.connect(URI, { dbName: "LIbrary_Managment" })
  .then(() => console.log("Connection successful"))
};

module.exports = connectMongoDB;
