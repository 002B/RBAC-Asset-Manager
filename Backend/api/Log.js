const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function getLogReport(Com) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.log.report`]: { $exists: true } },
            { [`${Com}.log.report`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.log?.report) {
            return [];
        }

        return result[Com].log.report;
    } catch (error) {
        console.error('Error fetching log reports:', error);
        return [];
    }
}

async function getLogLogin(Com) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.log.login`]: { $exists: true } },
            { [`${Com}.log.login`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.log?.login) {
            return [];
        }

        return result?.[Com]?.log?.login || [];
    } catch (error) {
        console.error(`Error fetching login logs for ${Com}:`, error);
        return [];
    }
}

async function getLogItem(Com) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.log.item`]: { $exists: true } },
            { [`${Com}.log.item`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.log?.item) {
            return [];
        }

        return result?.[Com]?.log?.item || [];
    } catch (error) {
        console.error(`Error fetching item logs for ${Com}:`, error);
        return [];
    }
}

async function getNextCheck(Com, Bran) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.branch.${Bran}.check.next_check`]: { $exists: true } },
            { [`${Com}.branch.${Bran}.check.next_check`]: 1, _id: 0 }
        ).lean();
        if (!result || !result[Com]?.branch?.[Bran]?.check?.next_check) {
            return null;
        }

        return result?.[Com]?.branch?.[Bran]?.check?.next_check || null;
    } catch (error) {
        console.error(`Error fetching next check for ${Com}/${Bran}:`, error);
        return null;
    }
}

async function getLastCheck(Com, Bran) {
    try {
        const result = await CompanyModel.findOne(
            { [`${Com}.branch.${Bran}.check.last_check`]: { $exists: true } },
            { [`${Com}.branch.${Bran}.check.last_check`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.branch?.[Bran]?.check?.last_check) {
            return [];
        }


        return result?.[Com]?.branch?.[Bran]?.check?.last_check || [];
    } catch (error) {
        console.error(`Error fetching last check for ${Com}/${Bran}:`, error);
        return [];
    }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

router.get('/getLogReport/:company', async (req, res) => {
    const { company } = req.params;
    const report = await getLogReport(company);
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
