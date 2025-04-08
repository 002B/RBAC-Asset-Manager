const express = require('express');
const router = express.Router();
const logModel = require('./DB/logItem.js');

router.get('/getLogReport/:company/:status?', async (req, res) => {
    const { company, status } = req.params;
    try {
        const report = await getLogReport(company, status);
        res.json(report);
    } catch (error) {
        console.error(`Error fetching log report for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching log report' });
    }
});

router.get('/getLogReportCount/:company/:status?', async (req, res) => {
    const { company, status } = req.params;
    try {
        const reportCount = await getLogReportCount(company, status);
        res.json(reportCount);
    } catch (error) {
        console.error(`Error fetching log report count for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching log report count' });
    }
});

router.post('/createLogReport/:company/:id', async (req, res) => {
    const { company } = req.params;
    const data = req.body; 
    
    try {
        const reportCreated = await createLogReport(company , data);
        res.json(reportCreated);
    } catch (error) {
        console.error('Error creating log report:', error);
        res.status(500).json({ message: 'Error creating log report' });
    }
});

router.get('/getLogLogin/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const loginHistory = await getLogLogin(company);
        res.json(loginHistory);
    } catch (error) {
        console.error(`Error fetching login logs for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching login logs' });
    }
});

router.get('/getLogItem/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const itemHistory = await getLogItem(company);
        res.json(itemHistory);
    } catch (error) {
        console.error(`Error fetching item logs for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching item logs' });
    }
});

router.get('/getNextCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const nextCheck = await getNextCheck(company, branch);
        res.json(nextCheck);
    } catch (error) {
        console.error(`Error fetching next check for ${company}/${branch}:`, error);
        res.status(500).json({ message: 'Error fetching next check' });
    }
});

router.get('/getLastCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const lastCheck = await getLastCheck(company, branch);
        res.json(lastCheck);
    } catch (error) {
        console.error(`Error fetching last check for ${company}/${branch}:`, error);
        res.status(500).json({ message: 'Error fetching last check' });
    }
});

module.exports = router;


