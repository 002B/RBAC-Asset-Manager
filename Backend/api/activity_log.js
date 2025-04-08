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

router.get('/all', async (req, res) => {
    try {
        const logs = await getActivityLog();
        console.log('Fetched logs:', logs); // Log ข้อมูลที่ดึงมา
        if (!logs || logs.length === 0) {
            return res.status(404).json({ 
                message: 'No activity logs found',
                suggestion: 'Check if collection exists and contains data'
            });
        }
        res.json(logs);
    } catch (error) {
        console.error('Server error:', error); // Log ข้อผิดพลาดแบบละเอียด
        res.status(500).json({
            message: 'Error fetching activity logs',
            error: error.message,
            details: error // ส่งรายละเอียด error เพิ่มเติม
        });
    }
});

module.exports = router;