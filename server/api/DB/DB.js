const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB Connected...');
};

module.exports = connectDB;