const express = require('express');
const router = express.Router();
const activityLogModal = require('./DB/activityLogModal.js');

router.get('/all', async (req, res) => {
    try {
        const logs = await activityLogModal.find();
        if (!logs || logs.length === 0) {
            return res.status(404).json({ 
                message: 'No activity logs found',
                suggestion: 'Check if collection exists and contains data'
            });
        }
        res.json(logs);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
});

router.get('/login-logout', async (req, res) => {
    try {
        const logs = await activityLogModal.find({ action: { $in: ['login', 'logout'] } });
        if (!logs || logs.length === 0) {
            return res.status(404).json({ 
                message: 'No activity logs found',
                suggestion: 'Check if collection exists and contains data'
            });
        }
        res.json(logs);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
});

module.exports = router;
