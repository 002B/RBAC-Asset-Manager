const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

module.exports = connectDB;