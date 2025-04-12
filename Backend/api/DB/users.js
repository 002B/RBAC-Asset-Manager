const mongoose = require('mongoose');

const COLLECTION_NAME = 'users';

const Schema = new mongoose.Schema({}, { strict: false });

const Model = mongoose.model(
    COLLECTION_NAME,
    Schema,
    COLLECTION_NAME
);

module.exports = Model;