const express = require('express');
const router = express.Router();
const companyFunc = require('./company');

router.get('/getAllCompany', async (req, res) => {
    try {
        const count = await companyFunc.getAllCompany();
        res.json( count );
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all company' });
    }
});

router.get('/getAllBranch/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const branch = await companyFunc.getBranchList(company);
        if (branch.length === 0) {
            return res.status(404).json(branch);
        }
        res.json( branch );
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branch'});
    }
});

router.get('/getNextCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const nextCheck = await companyFunc.getNextCheck(company, branch);
        res.json(nextCheck);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching next check' });
    }
});

router.get('/getLastCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const lastCheck = await companyFunc.getLastCheck(company, branch);
        res.json(lastCheck);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching last check' });
    }
});

router.get('/getCompanyBranch/', async (req, res) => {
    const { company } = req.params;
    try {
        const branches = await companyFunc.getCompanyBranch(company);
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company branches' });
    }
});

module.exports = router;
