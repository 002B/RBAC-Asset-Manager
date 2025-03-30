const express = require("express");
const router = express.Router();
const fs = require("fs");

const filePath = "./data/permission.json";

async function getAllUsers() {
  try {
    const rawUsers = JSON.parse(fs.readFileSync(filePath));

    const users = Object.entries(rawUsers)
      .map(([key, value]) => {
        return Object.entries(value).map(([keys, values]) => {
          switch (values["role"]) {
            case "super_admin":
              values["display_role"] = "Super Admin";
              break;
            case "admin":
              values["display_role"] = "Admin";
              break;
            case "worker":
              values["display_role"] = "Worker";
              break;
            case "super_member":
              values["display_role"] = "Super Member";
              break;
            case "member":
              values["display_role"] = "Member";
              break;
          }
          return {
            display_name: values["display_name"],
            user: keys,
            company: key,
            role: values["role"],
            display_role: values["display_role"],
            branch: values["branch"],
          };
        });
      })
      .flat(2);

    return users;
  } catch (error) {
    console.log(error);
  }
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

module.exports = router;
