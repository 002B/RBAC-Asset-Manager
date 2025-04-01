const express = require("express");
const router = express.Router();
const User = require('./DB/userModel.js');

const getDisplayRole = (role) => {
  switch(role) {
    case "super_admin": return "Super Admin";
    case "admin": return "Admin";
    case "worker": return "Worker";
    case "super_member": return "Super Member";
    case "member": return "Member";
    default: return role;
  }
};

async function getAllUsers() {
  const users = await User.find({}).lean();
  return users.map(user => ({
    display_name: user.display_name,
    user: user.username,
    company: user.company,
    role: user.role,
    display_role: getDisplayRole(user.role),
    branch: user.branches
  }));
}

async function getAdminAndWorker() {
  const users = await User.find({
    role: { $in: ['admin', 'worker'] }
  }).lean();
  
  return users.map(user => ({
    display_name: user.display_name,
    user: user.username,
    company: user.company,
    role: user.role,
    display_role: getDisplayRole(user.role),
    branch: user.branches
  }));
}

router.post("/", async (req, res) => {
  try {
    const { username, password, company, display_name, role, branches } = req.body;
    
    const newUser = new User({
      username,
      password,
      company,
      display_name,
      role,
      branches: ['admin', 'worker', 'super_admin'].includes(role) ? [] : branches
    });
    
    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.password;
    userResponse.display_role = getDisplayRole(newUser.role);
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    
    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    console.log(user);
    
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    user.last_login = new Date();
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.display_role = getDisplayRole(user.role);
    
    res.json(userResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const updates = req.body;
    
    if (updates.password) {
      return res.status(400).json({ error: "Use /change-password to update password" });
    }
    
    if (updates.role && ['admin', 'worker', 'super_admin'].includes(updates.role)) {
      updates.branches = [];
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { username },
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userResponse = updatedUser.toObject();
    userResponse.display_role = getDisplayRole(updatedUser.role);
    
    res.json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/:username/change-password', async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const users = await getAdminAndWorker();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:company', async (req, res) => {
  try {
    const company = req.params.company;
    const users = await User.find({ company }).select('-password');
    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      display_role: getDisplayRole(user.role)
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select('-password');
    
    if (user) {
      const userResponse = user.toObject();
      userResponse.display_role = getDisplayRole(user.role);
      res.json(userResponse);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;