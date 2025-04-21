// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('./DB/users.js');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if token exists in their tokens array (if you're implementing token invalidation)
    const user = await User.findOne({ 
      _id: decoded._id,
      isActive: 'True'
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Attach user and token to request
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Error authenticating' });
  }
};

const authSuperMember = async (req, res, next) => {
  try {
    // First verify base authentication
    await auth(req, res, () => {});
    
    if (!req.user) return; // auth already handled the response
    
    const allowedRoles = ['Super Member', 'Worker', 'Admin', 'Super Admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  } catch (error) {
    console.error('Super Member auth error:', error);
    res.status(500).json({ message: 'Error authenticating' });
  }
};

// Auth for Worker, Admin, and Super Admin
const authWorkerAndAdmin = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user) return;
    
    const allowedRoles = ['Worker', 'Admin', 'Super Admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  } catch (error) {
    console.error('Worker/Admin auth error:', error);
    res.status(500).json({ message: 'Error authenticating' });
  }
};

// Auth for Admin and Super Admin
const authAdmin = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user) return;
    
    const allowedRoles = ['Admin', 'Super Admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Error authenticating' });
  }
};

module.exports = {
  auth,
  authSuperMember,
  authWorkerAndAdmin,
  authAdmin
};