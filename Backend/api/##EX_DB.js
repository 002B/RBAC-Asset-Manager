const express = require('express');
const router = express.Router();
const Modal = require('./DB/companyModal.js');

async function TEST() { //ฟังก์ชั่นอะไรก็ได้สักอย่าง
    try {
        const documents = await Modal.find({}); //ข้อมูลในCollection
        console.log(documents);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


router.get('/TEST', async (req, res) => {
    TEST()
});




module.exports = router;