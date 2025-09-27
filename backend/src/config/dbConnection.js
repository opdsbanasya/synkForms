const mongoose = require("mongoose");

const databaseURI = process.env.MONGODB_CONNECTION_STRING;

const connectToDatabase = async () => {
  await mongoose.connect(databaseURI);
};

module.exports = { connectToDatabase };
