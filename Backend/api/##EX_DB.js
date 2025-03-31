const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const COLLECTION_NAME = 'company'; //ชื่อCollection


const CompanyModel = mongoose.model(
    COLLECTION_NAME,
    new mongoose.Schema({}, { strict: false }),
    COLLECTION_NAME
);

async function TEST() { //ฟังก์ชั่นอะไรก็ได้สักอย่าง
    try {
        const documents = await CompanyModel.find({}); //ข้อมูลในCollection
        console.log(documents);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


router.get('/TEST', async (req, res) => {
});




module.exports = router;