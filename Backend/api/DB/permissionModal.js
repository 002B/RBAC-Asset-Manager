const mongoose = require('mongoose');

// User details schema (no _id)
const userDetailsSchema = new mongoose.Schema({
  display_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['member', 'super_member', 'worker', 'admin', 'super_admin']
  },
  branch: {
    type: [String],
    default: []
  }
}, { _id: false }); // Disable _id for user details

// User schema (nested under company)
const userSchema = new mongoose.Schema({
  // Dynamic user objects where keys are usernames
  // Using Map to preserve insertion order if needed
}, { _id: false, strict: false });

// Main permission schema
const permissionSchema = new mongoose.Schema({
  // Dynamic company objects where keys are company names
  // Each company contains user objects
}, { 
  collection: 'permission',
  strict: false, // Allows dynamic company names
  versionKey: false // Disable __v field
});

// Create the model
const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;