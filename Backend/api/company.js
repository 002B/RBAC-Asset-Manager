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

        if (!result || !result[Com] || !result[Com].branch) {
            return 0;
        }

        return Object.keys(result[Com].branch).length;
    } catch (error) {
        console.error('Error fetching branch count:', error);
        return 0;
    }
}


async function getBranchList(Com) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}`]: { $exists: true } },
            { [`${Com}`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com] || !result[Com].branch) {
            return [];
        }
        
        return Object.keys(result[Com].branch);
    } catch (error) {
        console.error('Error fetching branch list:', error);
        return [];
    }
}

async function getCompanyCount() {
    try {
        const result = await CompanyModel.find({}).lean();
        return result.length;
    } catch (error) {
        console.error('Error fetching company count:', error);
        return 0;
    }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

router.get('/getCount/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const count = await getBranchCount(company);
        res.json({ branchCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branch count' });
    }
});

router.get('/getCount/:company/:branch', async (req, res) => {
    const { company } = req.params;
    try {
        const count = await getBranchCount(company);
        res.json({ branchCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branch count' });
    }
});

router.get('/getBranchList/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const list = await getBranchList(company);
        res.json({ branchList: list });
    } catch (error) {
        console.error('Error in /getBranchList:', error);
        res.status(500).json({ message: 'Error fetching branch list', error: error.message });
    }
});

module.exports = router;

