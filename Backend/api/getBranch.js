const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function getBranchCount(Com) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.log`]: { $exists: true } },
            { [`${Com}.branch`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.log?.report) {
            return [];
        }

        return Object.keys(company[Com]["branch"]).length;
    } catch (error) {
        console.error('Error fetching log reports:', error);
        return 0;
    }
}

async function getBranchList(Com) {
    try {
        const result = await Test.findOne(
            { [`${Com}`]: { $exists: true } },
            { [`${Com}`]: 1, _id: 0 }
        ).lean();
    
        return Object.keys(result[Com]["branch"]);
    } catch (error) {
        console.error('Error fetching log reports:', error);
        return [];
    }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

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