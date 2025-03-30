const express = require('express');
const router = express.Router();
const company = require('../data/company.json'); 
const user = require('../data/permission.json'); 


function getAllUser() {
    return Object.entries(user).map(([key, value]) => {
        return Object.entries(value).map(([keys, values]) => {
            return {
                username: keys,
                display_name: values["display_name"],
                branch: values["branch"],
            };
        });
    }).flat(2);
}


function getCompanyUser(Com) {
    return Object.entries(user[Com]).map(([key, value]) => {
        return {
            username: key,
            display_name: value["display_name"],
            branch: value["branch"],
        };
    });
}

function getAdminAndWorker() {
    const users = Object.entries(user).map(([key, value]) => {
        return Object.entries(value).map(([keys, values]) => {
            if (values["role"] === "admin" || values["role"] === "worker") {
                switch (values["role"]) {
                    case "admin":
                        values["display_role"] = "Admin";
                        break;
                    case "worker":
                        values["display_role"] = "Worker";
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
            }
            return null; 
        });
    }).flat(2);
    return users.filter(user => user !== null);
}

router.get('/users', (req, res) => {
    const users = getAllUser();
    res.json(users);
});

router.get('/users/:company', (req, res) => {
    const { company } = req.params;
    if (user[company]) {
        res.json(getCompanyUser(company));
    } else {
        res.status(404).json({ message: 'Company not found' });
    }
});

router.get('/users/admin-worker', (req, res) => {
    const users = getAdminAndWorker();
    res.json(users);
});

module.exports = router;