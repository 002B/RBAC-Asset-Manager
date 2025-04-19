const express = require('express');
const router = express.Router();
const activityFunc = require('./activityLog');

router.get('/all', async (req, res) => {
    try {
        const logs = await activityFunc.getActivityLog();
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
        const logs = await activityFunc.getActivityLoginLogout();
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

router.post('/create', async (req, res) => {
    try {
        const logData = req.body;
        const newLog = await activityFunc.createLog(logData);
        res.status(201).json(newLog);
    } catch (error) {
        console.error('Error creating activity log:', error);
        res.status(500).json({
            message: 'Error creating activity log',
            error: error.message
        });
    }
});


module.exports = router;
