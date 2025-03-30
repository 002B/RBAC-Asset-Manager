const express = require('express');
const router = express.Router();
const company = require('../data/company.json'); 

function getBranchCount(Com) {
    if (company[Com]) {
        return Object.keys(company[Com]["branch"]).length;
    } else {
        return 0;
    }
}

function getBranchList(Com) {
    if (company[Com]) {
        return Object.keys(company[Com]["branch"]);
    } else {
        return [];
    }
}

router.get('/getBranchCount/:company', (req, res) => {
    const { companyName } = req.params;
    if (company[companyName]) {
        res.json( getBranchCount(companyName) );
    } else {
        res.status(404).json({ message: 'Company not found' });
    }
});

router.get('/getBranchList/:company', (req, res) => {
    const { companyName } = req.params;
    if (company[companyName]) {
        res.json( getBranchList(companyName) );
    } else {
        res.status(404).json({ message: 'Company not found' });
    }
});

module.exports = router;