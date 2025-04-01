const mongoose = require('mongoose');

const COLLECTION_NAME = 'company';

const checkSchema = new mongoose.Schema({
    next_check: String,
    last_check: [String]
});

const itemLogSchema = new mongoose.Schema({
    Install: String
});

const itemSchema = new mongoose.Schema({
    brand: String,
    type: String,
    capacity: String,
    install_by: String,
    install_date: String,
    exp_date: String,
    location: String,
    color: String,
    next_check: String,
    last_check: String,
    status: String,
    log: itemLogSchema
});

const branchSchema = new mongoose.Schema({
    check: checkSchema,
    item: { type: Map, of: itemSchema }
});

const reportLogSchema = new mongoose.Schema({
    serial: String,
    company: String,
    branch: String,
    sender: String,
    date: String,
    time: String,
    hasImg: String,
    hasProblem: String,
    status: String
});

const companyLogSchema = new mongoose.Schema({
    login: [[String]],
    report: [reportLogSchema],
    item: [[String]]
});

const companySchema = new mongoose.Schema({
    companies: {
        type: Map,
        of: new mongoose.Schema({
            branch: {
                type: Map,
                of: branchSchema
            },
            log: companyLogSchema
        })
    }
}, { collection: COLLECTION_NAME });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;