const express = require('express');
const router = express.Router();
const reportFunc = require('./report');
const itemFunc = require('./item');

const handleError = (res, message, error = null, statusCode = 500) => {
    console.error(message, error || '');
    res.status(statusCode).json({ message });
};

const validateParams = (params, res) => {
    for (const [key, value] of Object.entries(params)) {
        if (!value?.trim()) {
            res.status(400).json({ message: `${key} must not be empty` });
            return false;
        }
    }
    return true;
};

router.get('/getAllReport', async (req, res) => {
    try {
        const data = await reportFunc.getAllReport();
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports', error);
    }
});

router.get('/getAllReport/count', async (req, res) => {
    try {
        const count = await reportFunc.getAllReportCount();
        res.json(count);
    } catch (error) {
        handleError(res, 'Error fetching report count', error);
    }
});

router.get('/getReportByCom/:company', async (req, res) => {
    const { company } = req.params;
    if (!validateParams({ company }, res)) return;

    try {
        const data = await reportFunc.getReportByCom(company);
        if (!data || data.length === 0) {
            res.status(404).json({ message: 'Company not found' });
        } else {
            res.json(data);
        }
    } catch (error) {
        handleError(res, 'Error fetching reports by company', error);
    }
});

router.get('/getReportByComCount/:company', async (req, res) => {
    const { company } = req.params;
    if (!validateParams({ company }, res)) return;

    try {
        const count = await reportFunc.getReportByComCount(company);
        if (!count) {
            res.status(404).json({ message: 'Company not found or has no reports' });
        } else {
            res.json(count);
        }
    } catch (error) {
        handleError(res, 'Error fetching report count by company', error);
    }
});

router.get('/getReportById/:id', async (req, res) => {
    const { id } = req.params;
    if (!validateParams({ id }, res)) return;

    try {
        const data = await reportFunc.getReportById(id);
        if (!data) {
            res.status(404).json({ error: 'Report not found' });
        } else {
            res.json(data);
        }
    } catch (error) {
        handleError(res, 'Internal server error', error);
    }
});

router.post('/createReport/:company/:branch/:id', async (req, res) => {
    const { company, branch, id } = req.params;
    const { data } = req.body;

    if (!validateParams({ company, branch, id }, res) || !data || !data.problem) {
        return res.status(400).json({ message: 'Incomplete data' });
    }

    try {
        const item = await itemFunc.checkItemExist(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const report = await reportFunc.createReport(company, branch, id, data);
        await itemFunc.updateStatus(id, 'reporting');
        res.json(report);
    } catch (error) {
        handleError(res, 'Error creating report', error);
    }
});

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


router.put('/updateReport/:status', async (req, res) => {
    const { status } = req.params;
    const { ids, assigner } = req.body;  // ids as an array and assigner as a single value (string)

    // Validation for ids array
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs are required and should be an array' });
    }

    // Validation for status
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['accept', 'reject', 'fixing', 'done'];

    if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    // Validation for assigner
    if (!assigner || typeof assigner !== 'string') {
        return res.status(400).json({ message: 'Valid assigner is required' });
    }

    try {
        // Call the updateStatus function with multiple ids, status, and assigner
        const updateResult = await reportFunc.updateStatus(ids, status.toLowerCase(), assigner);
        
        if (!updateResult) {
            return res.status(404).json({ message: 'No reports found for the provided IDs' });
        }

        res.json({ message: 'Reports updated successfully' });
    } catch (error) {
        handleError(res, 'Error updating report status', error);
    }
});


module.exports = router;

