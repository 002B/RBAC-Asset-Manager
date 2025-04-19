const express = require('express');
const router = express.Router();
const logModel = require('./DB/logItem.js');


async function getAllLog() {
    try {
        return await logModel.find({}).lean();
    } catch (error) {
        console.error('Error creating log:', error);
        return null;
    }
}

module.exports = {
    getAllLog
};


