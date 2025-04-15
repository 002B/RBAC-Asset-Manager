const CompanyModel = require('./DB/client.js');

async function getAllCompany() {
    try {
        const data = await CompanyModel.find({},{client_id : 1,_id : 0}).lean();
        return data;
    } catch (error) {
        console.log(error);
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