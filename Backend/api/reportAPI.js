const express = require("express");
const router = express.Router();
const reportFunc = require("./report");
const itemFunc = require("./item");

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
//get report by status (pending-Reporting/accepted-Bad/rejected-Good/fixing-Fixing/done-Ok)


//create report
router.post('/createReport/:company/:branch/:id', async(req, res) => {
    try {
        const { company, branch, id } = req.params
        const data = req.body.data
        if(!company) return res.status(404).json({ message: 'Company not found' });
        if(!branch) return res.status(404).json({ message: 'Branch not found' });
        if(!id) return res.status(404).json({ message: 'Id not found' });
        if(!data) return res.status(404).json({ message: 'Data not found' });
        if(!data.problem) return res.status(404).json({ message: 'Incomplete data' });



        const item = await itemFunc.checkItemExist(id)
        if(!item) return res.status(404).json({ message: 'Item not found' });



        const report = await reportFunc.createReport(company, branch, id, data)
        const itemStatus = await itemFunc.updateStatus(id, 2)
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error creating report' });
        console.log(error);
        
    }
});

//update report status (Accept/Reject/Fixing/Done)
module.exports = router;