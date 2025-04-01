const express = require("express");
const router = express.Router();
const PermissionModel = require('./DB/permissionModal.js');

async function getAllUsers() {
  const users = await PermissionModel.find();
  
  return users.flatMap(companyDoc => {
    const companies = Object.keys(companyDoc.toObject()).filter(key => key !== '_id');
    
    return companies.flatMap(companyName => {
      const companyUsers = companyDoc[companyName];
      
      return Object.entries(companyUsers).map(([username, userData]) => {
        let display_role = userData.role;
        switch(userData.role) {
          case "super_admin": display_role = "Super Admin"; break;
          case "admin": display_role = "Admin"; break;
          case "worker": display_role = "Worker"; break;
          case "super_member": display_role = "Super Member"; break;
          case "member": display_role = "Member"; break;
        }
        
        return {
          display_name: userData.display_name,
          user: username,
          company: companyName,
          role: userData.role,
          display_role,
          branch: userData.branch,
        };
      });
    });
  });
}


async function getAdminAndWorker() {
  try {
    const users = await getAllUsers();
    return users.filter(
      (user) => user.role === "admin" || user.role === "worker"
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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
    const users = await getAllUsers();
    const filteredUsers = users.filter((user) => user.company === company);
    res.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const users = await getAllUsers();
    const user = users.find((user) => user.user === username);
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
