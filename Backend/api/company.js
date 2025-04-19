const CompanyModel = require('./DB/client.js');

async function getAllCompany() {
    try {
        const data = await CompanyModel.find({}, {client_id: 1, _id: 0}).lean();
        const uniqueCompanies = [...new Set(data.map(item => item.client_id))];
        return uniqueCompanies.map(client_id => ({ client_id }));
    } catch (error) {
        throw error; 
    }
}

async function getCompanyBranch() {
    try {
        const data = await CompanyModel.find({}, { client_id: 1, client_branch_id: 1, _id: 0 }).lean();
        const uniqueCompanies = [...new Set(data.map(item => item.client_id))];
        const result = {};
        uniqueCompanies.forEach(client_id => {
            result[client_id] = data.filter(item => item.client_id === client_id).map(item => item.client_branch_id);
        });
        return result;
    } catch (error) {
        throw error; 
    }
}

async function getBranchList(company) {
    try {
        const data = await CompanyModel.find({ client_id: company }, { client_branch_id: 1 ,_id : 0}).lean();
        return data;
    } catch (error) {
        console.log(error);
    }
}
async function getNextCheck(company,branch) {
    try {
        const result = await CompanyModel.findOne(
            { client_id: company, 'client_branch_id': branch },
            {'next_check': 1, _id: 0 }
        ).lean();
        return result.next_check;
    } catch (error) {
        console.error(`Error fetching next check for ${company}/${branch}:`, error);
        return null;
    }
}

async function getLastCheck(company) {
    try{
        const result = await CompanyModel.findOne(
            { client_id: company },
            {'last_check': 1, _id: 0 }
        ).lean();
        return result.last_check;
    }catch(error){
        console.error(`Error fetching last check for ${company}:`, error);
        return null;
    }
}
module.exports = {getAllCompany,getBranchList,getCompanyBranch,getNextCheck,getLastCheck};
