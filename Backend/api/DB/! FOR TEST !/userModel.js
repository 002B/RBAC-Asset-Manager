const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  company: {
    type: String,
    required: true,
    enum: ['ThaiBev', 'SCB', 'Metthier', 'OtherCompany'],
  },
  display_name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['member', 'super_member', 'worker', 'admin', 'super_admin'],
    default: 'member'
  },
  branches: {
    type: [String],
    default: [],
    validate: {
      validator: function(branches) {
        // Workers and admins shouldn't have branches specified
        if (['worker', 'admin', 'super_admin'].includes(this.role)) {
          return branches.length === 0;
        }
        return true;
      },
      message: 'Admins/workers cannot have branch restrictions'
    }
  },
  last_login: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; // Never return password in queries
      return ret;
    }
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;