const express = require('express');
const router = express.Router();
const activityLogModal = require('./DB/activityLogModal.js');

async function getActivityLog() {
    try {
        const logs = await activityLogModal.find({}).lean();
        return logs;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }
}

async function searchActivityLogs(queryParams) {
    try {
        const filter = {};
        
        if (queryParams.username) {
            filter.username = queryParams.username;
        }
        if (queryParams.activity) {
            filter.activity = queryParams.activity;
        }
        if (queryParams.status) {
            filter.status = queryParams.status;
        }
        if (queryParams.date) {
            filter.date = queryParams.date;
        }
        if (queryParams.log_id) {
            filter.log_id = queryParams.log_id;
        }

        const logs = await activityLogModal.find(filter).lean();
        
        return logs;
    } catch (error) {
        console.error('Error searching activity logs:', error);
        throw error;
    }
}

router.get('/all', async (req, res) => {
    try {
        const logs = await getActivityLog();
        console.log('Fetched logs:', logs);
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

router.get('/filter', async (req, res) => {
    try {
        const logs = await searchActivityLogs(req.query);
        
        if (logs.length === 0) {
            return res.status(404).json({ 
                message: "No matching records found",
                suggestion: "Try different filter criteria"
            });
        }
       
        res.json(logs);
    } catch (error) {
        console.error('Filter error:', error);
        res.status(500).json({
            message: 'Error searching activity logs',
            error: error.message
        });
    }
});

module.exports = router;