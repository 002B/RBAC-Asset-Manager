import rawUsers from "../json/permission.json";

const users = Object.entries(rawUsers).map(([key, value]) => {
  return Object.entries(value).map(([keys, values]) => {
    return {
      display_name: values["display_name"],
      user: keys,
      pass: values["password"],
      company: key,
      role: values["role"],
      branch: values["branch"],
    };
  });
}).flat(2);

let response = [];

export async function getUser() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    return response;
  } catch (error) {
    return response;
  }
}

export async function login(username, password) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const foundUser = users.find(user => user.user === username && user.pass === password);
    switch (foundUser.role) {
      case "super_admin":
        foundUser.display_role = "Super Admin";
        break;
      case "admin":
        foundUser.display_role = "Admin";
        break;
      case "worker":
        foundUser.display_role = "Worker";
        break;
      case "super_member":
        foundUser.display_role = "Super Member";
        break;
      case "member":
        foundUser.display_role = "Member";
        break;
    }
    response = [200, { authToken: generateAuthToken(), user: {user:foundUser.user, role:foundUser.role,display_role : foundUser.display_role,company: foundUser.company, branch: foundUser.branch, display_name: foundUser.display_name} }];
    return response;
  } catch (error) {
    response = [401, { authToken: null, user: null }];
    return response;
  }
}

function generateAuthToken() {
  return Math.random().toString(36).substring(2);
}


function getAllUsers() {
  const users = Object.entries(rawUsers).map(([key, value]) => {
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
        branch: values["branch"]
      };
    });
  }).flat(2);
  return users;
}

function getMembers(company) {
  // return list of users in the same company 
  const allUsers = getAllUsers();
  return allUsers.filter((user) => user.company === company);
}

export { getAllUsers, getMembers };