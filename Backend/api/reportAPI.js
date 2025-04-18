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
            return res.status(400).json({ message: `${key} must not be empty` });
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
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by company', error);
    }
});

router.get('/getReportByComCount/:company', async (req, res) => {
    const { company } = req.params;
    if (!validateParams({ company }, res)) return;

    try {
        const count = await reportFunc.getReportByComCount(company);
        res.json(count);
    } catch (error) {
        handleError(res, 'Error fetching report count by company', error);
    }
});

router.get('/getReportByBranch/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    if (!validateParams({ company, branch }, res)) return;

    try {
        const data = await reportFunc.getReportByBranch(company, branch);
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by branch', error);
    }
});

router.get('/getReportStatusByBranch/:company/:branch/:status', async (req, res) => {
    const { company, branch, status } = req.params;
    if (!validateParams({ company, branch, status }, res)) return;

    try {
        const data = await reportFunc.getReportStatusByBranch(company, branch, status);
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by branch and status', error);
    }
});

router.get('/getReportStatusByBranch/count/:company/:branch/:status', async (req, res) => {
    const { company, branch, status } = req.params;
    if (!validateParams({ company, branch, status }, res)) return;

    try {
        const data = await reportFunc.getReportStatusByBranch(company, branch, status);
        res.json(data.length);
    } catch (error) {
        handleError(res, 'Error fetching reports by branch and status', error);
    }
});

router.get('/getReportStatusByCom/:company/:status', async (req, res) => {
    const { company, status } = req.params;
    if (!validateParams({ company, status }, res)) return;

    try {
        const data = await reportFunc.getReportStatusByCom(company, status);
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by company and status', error);
    }
});

router.get('/getReportStatusByCom/count/:company/:status', async (req, res) => {
    const { company, status } = req.params;
    if (!validateParams({ company, status }, res)) return;

    try {
        const data = await reportFunc.getReportStatusByCom(company, status);
        res.json(data.length);
    } catch (error) {
        handleError(res, 'Error fetching reports by company and status', error);
    }
});

router.get('/getReportById/:id', async (req, res) => {
    const { id } = req.params;
    if (!validateParams({ id }, res)) return;

    try {
        const data = await reportFunc.getReportById(id);
        res.json(data);
    } catch (error) {
        handleError(res, 'Internal server error', error);
    }
});

router.get('/getReportByUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID must not be empty" });
    }
    try {
        const data = await reportFunc.getReportByUser(userId);
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by user', error);
    }
});

router.post('/createReport/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!validateParams({ id }, res) || !data || !data.problem) {
        return res.status(400).json({ message: 'Incomplete data' });
    }

    try {
        const item = await itemFunc.checkItemExist(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const report = await reportFunc.createReport(item.client_id, item.client_branch_id, id, data);
        await itemFunc.updateStatus([id], 'reporting');
        res.json(report);
    } catch (error) {
        handleError(res, 'Error creating report', error);
    }
});

router.get('/getReportByStatus/:status', async (req, res) => {
    const status = req.params.status;
    if (!status) {
        return res.status(400).json({ message: "Status must not be empty" });
    }
    try {
        const data = await reportFunc.getReportByStatus(status);
        res.json(data);
    } catch (error) {
        handleError(res, 'Error fetching reports by status', error);
    }
});

router.put('/updateReport/:status', async (req, res) => {
    const { status } = req.params;
    const { ids, assigner } = req.body;  

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs are required and should be an array' });
    }
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'accepted', 'fixing', 'done', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updateResult = await reportFunc.updateReport(ids, status.toLowerCase(), assigner);
        if (!updateResult.success) return res.status(404).json({ message: updateResult.message });

        const updateStatusResult = await itemFunc.updateStatus(updateResult.itemIds, updateResult.itemStatus);

        if (!updateStatusResult) return res.status(404).json({ message: 'Error updating item status' });
        
        res.json({ message: 'Report and items updated successfully' });
    } catch (error) {
        handleError(res, 'Error updating report', error);
    }
});

module.exports = router;

