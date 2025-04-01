const mongoose = require('mongoose');

const COLLECTION_NAME = 'company';

const companySchema = new mongoose.Schema({
    }, { collection: COLLECTION_NAME });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;