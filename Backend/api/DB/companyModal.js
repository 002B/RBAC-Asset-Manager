const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
    next_check: String,
    last_check: [String]
});

const itemLogSchema = new mongoose.Schema({
    Install: String
}, { _id: false });

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
}, { _id: false });

const branchSchema = new mongoose.Schema({
    check: checkSchema,
    item: { 
        type: Map, 
        of: itemSchema,
        default: () => new Map()
    }
}, { _id: false });

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
}, { _id: false });

const companyLogSchema = new mongoose.Schema({
    login: [[String]],
    report: [reportLogSchema],
    item: [[String]]
}, { _id: false });

const companyDataSchema = new mongoose.Schema({
    branch: {
        type: Map,
        of: branchSchema,
        default: () => new Map()
    },
    log: companyLogSchema
}, { _id: false });


const companySchema = new mongoose.Schema({
    companyDataSchema
}, { 
    collection: 'company',
    strict: false,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;