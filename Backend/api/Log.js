const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

async function getLogReport(Com) {
    try {
        const documents = await CompanyModel.find({});
        return documents[0][Com].log.report;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getLogLogin(Com) {
    try {
        const documents = await CompanyModel.find({});
        return documents[0][Com].log.login;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getLogItem(Com) {
    try {
        const documents = await CompanyModel.find({});
        return documents[0][Com].log.item;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getNextCheck(Com, Bran) {
    try {
        const documents = await CompanyModel.find({});
        return documents[0][Com].branch[Bran].check.next_check;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getLastCheck(Com, Bran) {
    try {
        const documents = await CompanyModel.find({});
        return documents[0][Com].branch[Bran].check.last_check;
    } catch (error) {
        console.error(error);
        return [];
    }
}

router.get('/getLogReport/:company', async (req, res) => {
    const { company } = req.params;
    const report =  await getLogReport(company);
    res.json(report);
});

router.get('/getLogLogin/:company', async (req, res) => {
    const { company } = req.params;
    const loginHistory = await getLogLogin(company);
    res.json(loginHistory);
});

router.get('/getLogItem/:company', async (req, res) => {
    const { company } = req.params;
    const itemHistory = await getLogItem(company);
    res.json(itemHistory);
});

router.get('/getNextCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    const nextCheck = await getNextCheck(company, branch);
    res.json(nextCheck);
});

router.get('/getLastCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    const lastCheck = await getLastCheck(company, branch);
    res.json(lastCheck);
});

module.exports = router;
