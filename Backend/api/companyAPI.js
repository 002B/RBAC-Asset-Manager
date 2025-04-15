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
        const count = await companyFunc.getBranchList(company);
        res.json( count );
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branch'});
    }
});

module.exports = router;
