const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const user = require('../data/permission.json');

function getUserCount(Com) { 
    if (user[Com]) {
        return Object.entries(user[Com]).length;
    } else {
        return 0;
    }
}

router.get('/:Com', (req, res) => {
    const Com = req.params.Com;
    const count = getUserCount(Com);
    res.json({ count });
});


function getAllUserCount() {
    let count = 0;
    Object.entries(user).map(([key, value]) => {
        count += Object.entries(value).length;
    });
    return count;
}

router.get('/', (req, res) => {
    const count = getAllUserCount();
    res.json({ count });
});


module.exports = router;