const mongoose = require('mongoose');

const COLLECTION_NAME = 'report';

const Schema = new mongoose.Schema({
    serial : String,
    company : String,
    branch : String,
    problem : String,
    date : String
}, { collection: COLLECTION_NAME });

const Model = mongoose.model(
    COLLECTION_NAME,
    Schema,
    COLLECTION_NAME
);

module.exports = Model;