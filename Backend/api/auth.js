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

module.exports = auth;