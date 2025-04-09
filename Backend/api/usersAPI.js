const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllUsersCount,
  getClientUser,
  getOperatorUser,
  getUser,
  getUsersCount,
  createUser,
  login,
  updateUser,
  deleteUser,
} = require("./users");

router.get("/getAllUsers", async (req, res) => {
  try {
    const data = await getAllUsers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

router.get("/getClientUser/:client_id", async (req, res) => {
  const { client_id } = req.params;
  try {
    const data = await getClientUser(client_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

router.get("/getOperatorUser", async (req, res) => {
  try {
    const data = await getOperatorUser();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

router.get("/getAllUsersCount", async (req, res) => {
  try {
    const count = await getAllUsersCount();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count" });
  }
});

router.get("/getUsersCount/:client_id", async (req, res) => {
  const { client_id } = req.params;
  try {
    const count = await getUsersCount(client_id);
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count" });
  }
});

router.get("/getUser/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await getUser(username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

router.post("/createUser", async (req, res) => {
  try {
      const userData = req.body;
      const newUser = await createUser(userData);
      res.status(201).json(newUser);
  } catch (error) {
      if (error.message === 'Missing required fields') {
          res.status(400).json({ message: error.message });
      } else if (error.message === 'Username already exists') {
          res.status(409).json({ message: error.message });
      } else {
          res.status(500).json({ message: "Error creating user" });
      }
  }
});

router.post("/login", async (req, res) => {
  try {
      const { username, password } = req.body;
      
      if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required" });
      }

      const [status, response] = await login(username, password);
      res.status(status).json(response);
  } catch (error) {
      res.status(500).json({ message: "Error processing login" });
  }
});

router.put("/updateUser/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await updateUser(username, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

router.delete("/deleteUser/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await deleteUser(username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;