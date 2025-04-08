const express = require("express");
const router = express.Router();
const reportFunc = require("./report");


//get all report
/*
⁡⁢⁢⁢​‌‌‍GET​⁡
*/
router.get('/getAllReport', async (req, res) => {
    try {
        const data = await reportFunc.getAllReport()
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report details' });
    }
});

//get all report count
/*
​‌‌‍⁡⁢⁢⁢GET⁡​
*/
router.get('/getAllReport/count', async (req, res) => {
    try {
        const count = await reportFunc.getAllReportCount()
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report count' });
    }
});

//get report by company
//get report by company count
//get report by branch
//get report by branch count
//get report by id
//get report by user
//get report by status (pending/accepted/rejected/fixing/done)

//!ยังไม่เสร็จ
//create report
router.post('/createReport/:company/:branch/:id', async(req, res) => {
    const { company, branch, id } = req.params
    const data = req.body.data
    try {
        const report = await reportFunc.createReport(company, branch, id, data)
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error creating report' });
    }
});

//update report status
module.exports = router;