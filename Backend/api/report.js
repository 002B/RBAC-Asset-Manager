const reportModel = require("./DB/report.js");

async function getAllReport() {
    try {
        return await reportModel.find({}, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getAllReportCount() {
    try {
        const docs = await reportModel.find({}, { _id: 0 }).lean();
        return docs.length;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getReportByCom(company) {
    try {
        return await reportModel.find({ "client_id": company }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getReportByComCount(company) {
    try {
        const docs = await reportModel.find({ "client_id": company }, { _id: 0 }).lean();
        return docs.length;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getReportByBranch(company, branch) {
    try {
        return await reportModel.find({ "client_id": company, "client_branch_id": branch }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getReportByBranchCount(company, branch) {
    try {
        const docs = await reportModel.find({ "client_id": company, "client_branch_id": branch }, { _id: 0 }).lean();
        return docs.length;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getReportById(id) {
    try {
        if (!id || id.trim() === "") {
            throw new Error("ID must not be empty");
        }
        const docs = await reportModel.find({ "report_id": id }, { _id: 0 }).lean();
        return docs.length ? docs : null;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getReportByUser(user) {
    try {
        return await reportModel.find({ "assigner": user }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getReportByStatus(status) {
    try {
        return await reportModel.find({ "status": status }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function createReport(company, branch, id, data) {
    try {
        const lastItem = await reportModel.find({}).lean();
        const lastNumber = lastItem.length ? parseInt(lastItem[lastItem.length - 1].item_id.split('-').pop()) : 0;
        await reportModel.create({
            "report_id": `RP-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`,
            "item_id": id,
            "client_id": company,
            "client_branch_id": branch,
            "createAt": new Date().toISOString(),
            "status": "Pending",
            "assigner": "None",
            "problem": data.problem
        });
        return true;
    } catch (error) {
        console.error("Error adding new item:", error);
        return false;
    }
}

async function updateReport(ids, status, assigner) {
    try {
        const docs = await reportModel.find({ "report_id": { $in: ids } });
        if (!docs.length) {
            return { success: false, message: 'No reports found for the provided IDs' };
        }

        const itemIds = [];
        for (const doc of docs) {
            doc.set({
                "status": status,
                "assigner": assigner || doc["assigner"]
            });

            await doc.save();
            itemIds.push(doc.item_id);
        }
        const itemStatus = getItemStatusByReportStatus(status)
        return { success: true, itemIds,  itemStatus};
    } catch (error) {
        console.error('Error updating report:', error);
        return { success: false, message: 'Error updating report' };
    }
}

function getItemStatusByReportStatus(reportStatus) {
    switch (reportStatus) {
        case 'pending':
            return 'reporting';
        case 'accepted':
            return 'bad';
        case 'fixing':
            return 'fixing';
        case 'done':
        case 'rejected':
        default:
            return 'OK';
    }
}

module.exports = {
    getAllReport,
    getAllReportCount,
    createReport,
    updateReport,
    getReportByCom,
    getReportByComCount,
    getReportByBranch,
    getReportByBranchCount,
    getReportById,
    getReportByUser,
    getReportByStatus
};

