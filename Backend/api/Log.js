const express = require('express');
const router = express.Router();
const logModel = require('./DB/logItem.js');


function filterByStatus(report, status) {
    switch (status) {
        case '0':
            return report.filter(item => item.status === 'Rejected');
        case '1':
            return report.filter(item => item.status === 'Pending');
        case '2':
            return report.filter(item => item.status === 'Accepted');
        case '3':
            return report.filter(item => item.status === 'Fixing');
        case '4':
            return report.filter(item => item.status === 'Finished');
        default:
            return report;
    }
}

async function getLogReport(Com, status) {
    try {
        const result = await logModel.findOne(
            { [`${Com}.log.report`]: { $exists: true } },
            { [`${Com}.log.report`]: 1, _id: 0 }
        ).lean();

        if (!result || !result[Com]?.log?.report) {
            return [];
        }

        const report = result[Com].log.report;
        return filterByStatus(report, status || null);
    } catch (error) {
        console.error('Error fetching log reports:', error);
        return [];
    }
}

async function getLogReportCount(Com, status) {
    try {
        const result = await logModel.findOne(
            { [`${Com}.log.report`]: { $exists: true } },
            { [`${Com}.log.report`]: 1, _id: 0 }
        ).lean();
        
        if (!result || !result[Com]?.log?.report) {
            return 0;
        }

        const report = result[Com].log.report;
        return filterByStatus(report, status || null).length;
    } catch (error) {
        console.error(`Error fetching log reports count for ${Com}:`, error);
        return 0;
    }
}

async function createLogReport(Com, Bran, Data) {
    try {
        await logModel.updateOne(
            { [`${Com}`]: { $exists: true } },
            { $push: { [`${Com}.branch.${Bran}.log.report`]: Data } }
        );
        return true
    } catch (error) {
        return false
    }
}

/************************************************************* */
async function getLogLogin(Com) {
    try {
        const result = await logModel.findOne(
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
/************************************************************* */
async function getLogItem(Com) {
    try {
        const result = await logModel.findOne(
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
        const result = await logModel.findOne(
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
        const result = await logModel.findOne(
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

router.get('/getLogReport/:company/:status?', async (req, res) => {
    const { company, status } = req.params;
    try {
        const report = await getLogReport(company, status);
        res.json(report);
    } catch (error) {
        console.error(`Error fetching log report for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching log report' });
    }
});

router.get('/getLogReportCount/:company/:status?', async (req, res) => {
    const { company, status } = req.params;
    try {
        const reportCount = await getLogReportCount(company, status);
        res.json(reportCount);
    } catch (error) {
        console.error(`Error fetching log report count for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching log report count' });
    }
});

router.post('/createLogReport/:company/:id', async (req, res) => {
    const { company } = req.params;
    const data = req.body; 
    
    try {
        const reportCreated = await createLogReport(company , data);
        res.json(reportCreated);
    } catch (error) {
        console.error('Error creating log report:', error);
        res.status(500).json({ message: 'Error creating log report' });
    }
});

router.get('/getLogLogin/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const loginHistory = await getLogLogin(company);
        res.json(loginHistory);
    } catch (error) {
        console.error(`Error fetching login logs for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching login logs' });
    }
});

router.get('/getLogItem/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const itemHistory = await getLogItem(company);
        res.json(itemHistory);
    } catch (error) {
        console.error(`Error fetching item logs for ${company}:`, error);
        res.status(500).json({ message: 'Error fetching item logs' });
    }
});

router.get('/getNextCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const nextCheck = await getNextCheck(company, branch);
        res.json(nextCheck);
    } catch (error) {
        console.error(`Error fetching next check for ${company}/${branch}:`, error);
        res.status(500).json({ message: 'Error fetching next check' });
    }
});

router.get('/getLastCheck/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const lastCheck = await getLastCheck(company, branch);
        res.json(lastCheck);
    } catch (error) {
        console.error(`Error fetching last check for ${company}/${branch}:`, error);
        res.status(500).json({ message: 'Error fetching last check' });
    }
});

module.exports = router;


