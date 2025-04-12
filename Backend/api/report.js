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

//get report by company
async function getReportByCom(company) {
    try{
        const doc = await reportModel.find({ "client_id": company }, { _id: 0 }).lean()
        return doc
    }catch(error){
        console.error('Error fetching data:', error);
        return [];
    }
    
}
//get report by company count
async function getReportByComCount(company) {
    try{
        const doc = await reportModel.find({ "client_id": company }, { _id: 0 }).lean()
        return doc.length
    }catch{
        console.error('Error ComCount fetching data:', error);
        return 0;
    }
}
//get report by branch
async function getReportByBranch(company, branch) {
    try{
        const doc = await reportModel.find({"client_id": company, "client_branch_id": branch }, { _id: 0 }).lean()
        return doc
    }catch(error){
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getReportByBranchCount(company,branch) {
    try{
        const doc = await reportModel.find({"client_id": company, "client_branch_id": branch }, { _id: 0 }).lean()
        return doc.length
    }catch(error){
        console.error('Error fetching data:', error);
        return 0;
    }
}


async function getReportById(id) {
    try {
        if (!id || id.trim() === "") {
            throw new Error("ID must not be empty");
        }
        const doc = await reportModel.find({ "report_id": id }, { _id: 0 }).lean();
        
        if (!doc || doc.length === 0) {
            return null;
        }
        
        return doc;
    } catch(error) {
        console.error('Error fetching data:', error);
        throw error; // ส่ง error ต่อไปให้ route จัดการ
    }
}
//get report by user
async function getReportByUser(user) {
    try{
        const doc = await reportModel.find({ "assigner": user }, { _id: 0 }).lean()
        return doc
    }catch(error){
        console.error('Error fetching  data:', error);
        return [];   
    }
}

//get report by status (pending/accepted/rejected/fixing/done)
async function getReportByStatus(status) {
    try{
        const doc = await reportModel.find({ "status": status }, { _id: 0 }).lean()
        return doc
    }catch(error){
     console.error('Error fetching  data:', error);
     return [];   
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

async function updateStatus(id, status) {
    try {
        const doc = await reportModel.findOne({ "report_id": id });
        if (!doc) {
            return false;
        }
        doc.set({
            "report_id": doc["report_id"],
            "item_id": doc["item_id"],
            "client_id": doc["client_id"],
            "client_branch_id": doc["client_branch_id"],
            "status": status,
            "assigner": doc["assigner"],
            "problem": doc["problem"]
        });
        await doc.save();
        return true;
    } catch (error) {
        console.error("Error updating item status:", error);
        return false;
    }
}

module.exports = {getAllReport, getAllReportCount, createReport, updateStatus, getReportByCom,getReportByComCount,getReportByBranch , getReportByBranchCount , getReportById ,getReportByUser , getReportByStatus}
