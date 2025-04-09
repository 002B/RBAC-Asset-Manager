const reportModel = require("./DB/report.js");

async function getAllReport() {  
    try {
        const doc = await reportModel.find({}, { _id: 0 }).lean()
        return doc;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getAllReportCount() {
    try {
        const doc = await reportModel.find({}, { _id: 0 }).lean()
        return doc.length;
    }catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}



async function createReport(company, branch, id, data) {
    try {
        const lastItem = await reportModel.find({}).lean();
        if (lastItem.length === 0) return "RP-2025-0000001";
        const lastNumber = parseInt(lastItem[lastItem.length - 1].item_id.split('-').pop());
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

module.exports = {getAllReport, getAllReportCount, createReport}