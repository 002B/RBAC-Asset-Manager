const CompanyModel = require('./DB/client.js');

async function getAllCompany() {
    try {
        const data = await CompanyModel.find({}, {client_id: 1, _id: 0}).lean();
        // Extract client_ids, convert to Set to remove duplicates, then back to array
        const uniqueCompanies = [...new Set(data.map(item => item.client_id))];
        return uniqueCompanies.map(client_id => ({ client_id }));
    } catch (error) {
        console.log(error);
        throw error; // Make sure to throw so the route can catch it
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

module.exports = {getAllCompany,getBranchList};