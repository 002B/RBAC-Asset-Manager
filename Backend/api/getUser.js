const express = require('express');
const router = express.Router();
const PermissionModel = require('./DB/userModel.js');

async function getUserCount(companyName) {
    try {
        const document = await PermissionModel.findOne({});
        if (!document || !document[companyName]) {
            return 0;
        }
        return Object.keys(document[companyName]).length;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getAllUserCount() {
    try {
        const document = await PermissionModel.findOne({});
        if (!document) return 0;

        let count = 0;
        for (const company in document) {
            if (Object.prototype.hasOwnProperty.call(document, company)) {
                count += Object.keys(document[company]).length;
            }
        }
        return count;
    } catch (error) {
        console.error('Error fetching all user counts:', error);
        throw error;
    }
}

router.get('/:company', async (req, res) => {
    try {
        const companyName = req.params.company;
        const count = await getUserCount(companyName);
        res.json({ company: companyName, userCount: count });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const count = await getAllUserCount();
        res.json({ totalUserCount: count });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
