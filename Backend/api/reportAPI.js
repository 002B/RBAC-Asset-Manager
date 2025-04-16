const express = require("express");
const router = express.Router();
const reportFunc = require("./report");


//get all report ##DONE##
/*
⁡⁢⁢⁢​‌‌‍GET​⁡
*/
router.get('/getAllReport', async (req, res) => {
    try {
        const data = await reportFunc.getAllReport();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report details' });
    }
});

//get all report count ##DONE##
/*
​‌‌‍⁡⁢⁢⁢GET⁡​
*/ 
router.get('/getAllReport/count', async (req, res) => {
    try {
        const count = await reportFunc.getAllReportCount();
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report count' });
    }
});

//get report by company ##DONE##
router.get('/getReportByCom/:company', async (req, res) => {
    const company = req.params.company?.trim();
    if (!company) {
        return res.status(400).json({ message: "Company must not be empty" });
    }

    try {
        const data = await reportFunc.getReportByCom(company);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report by company' });
    }
});
//get report by company count ##DONE##
router.get('/getReportByComCount/:company', async (req, res) => {
    const company = req.params.company?.trim();
    if (!company) {
        return res.status(400).json({ message: "Company must not be empty" });
    }

    try {
        const count = await reportFunc.getReportByComCount(company);
        if (!count) {
            return res.status(404).json({ message: "Company not found or has no reports" });
        }
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report count by company' });
    }
});

//get report by branch ##DONE##
router.get('/getReportByBranch/:company/:branch', async (req, res) => {
    const company = req.params.company?.trim();
    const branch = req.params.branch?.trim();

    if (!company || !branch) {
        return res.status(400).json({ message: "Company and Branch must not be empty" });
    }

    try {
        const data = await reportFunc.getReportByBranch(company, branch);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Company or Branch not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report by branch' });
    }
});

//get report by branch count ##DONE##
router.get('/getReportByBranchCount/:company/:branch', async (req, res) => {
    const company = req.params.company?.trim();
    const branch = req.params.branch?.trim();

    if (!company || !branch) {
        return res.status(400).json({ message: "Company and Branch must not be empty" });
    }

    try {
        const count = await reportFunc.getReportByBranchCount(company, branch);
        if (!count) {
            return res.status(404).json({ message: "Company or Branch not found or no reports" });
        }
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branch report count' });
    }
});

//get report by id ##DONE##
router.get('/getReportById/:id', async (req, res) => {
    const id = req.params.id?.trim();
    if (!id) {
        return res.status(400).json({ error: "ID must not be empty" });
    }

    try {
        const data = await reportFunc.getReportById(id);
        if (!data) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

//get report by user ##DONE##
router.get('/getReportByUser/:assigner', async (req, res) => {
    const assigner = req.params.assigner?.trim();
    if (!assigner) {
        return res.status(400).json({ message: "Assigner must not be empty" });
    }

    try {
        const data = await reportFunc.getReportByUser(assigner);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Assigner not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports by user' });
    }
});

//get report by status (pending/accepted/rejected/fixing/done) ##DONE##
router.get('/getReportByStatus/:status', async (req, res) => {
    const status = req.params.status?.trim();
    if (!status) {
        return res.status(400).json({ message: "Status must not be empty" });
    }

    try {
        const data = await reportFunc.getReportByStatus(status);
        if (!data || data.length === 0) {
            return res.status(404).json([]);
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports by status' });
    }
});

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
        await itemFunc.updateStatus(id, "reporting")
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error creating report' });
        console.log(error);
        
    }
});


router.put('/updateReport/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params
        if(!id) return res.status(404).json({ message: 'Id not found' });
        if(!status) return res.status(404).json({ message: 'Status not found' });


        switch (status.toLowerCase()) {
            case "accept":
                await reportFunc.updateStatus(id, "accepted")
                await itemFunc.updateStatus(id, "bad")
                return res.json({ message: 'Report status updated to accepted' });
            case "reject":
                await reportFunc.updateStatus(id, "rejected")
                await itemFunc.updateStatus(id, "ok")
                return res.json({ message: 'Report status updated to rejected' });
            case "fixing":
                await reportFunc.updateStatus(id, "fixing")
                await itemFunc.updateStatus(id, "fixing")
                return res.json({ message: 'Report status updated to fixing' });
            case "done":
                await reportFunc.updateStatus(id, "done")
                await itemFunc.updateStatus(id, "ok")
                return res.json({ message: 'Report status updated to done' });
            default:
                return res.status(404).json({ message: 'Status not found' });
        }
    } catch (error) {
        
    }
})
module.exports = router;