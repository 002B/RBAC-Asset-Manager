const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const COLLECTION_NAME = 'users';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    display_name: String,
    role: { type: String, enum: ['Member', 'Super Member', 'Worker', 'Admin', 'Super Admin'], required: true },
    client: String,
    client_access: [String],
    lastLogin: Date,
    isActive: { type: String, default: 'True' }
  }, { timestamps: true });
  
  // Add method to generate JWT
  userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
      { 
        _id: this._id, 
        username: this.username,
        role: this.role,
        display_name: this.display_name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return token;
  };

const Model = mongoose.model(
    COLLECTION_NAME,
    userSchema,
    COLLECTION_NAME
);

module.exports = Model;