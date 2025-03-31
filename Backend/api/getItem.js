const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const app = express();
const port = 3000;
const Modal = require('./DB/companyModal.js');


// กำหนดพาธของไฟล์ JSON
async function getAllItems() {
    try {
        const documents = await Modal.find({}).lean(); // ดึงข้อมูลทุกบริษัท
        let totalCount = 0;

        documents.forEach(company => {
            Object.values(company).forEach(companyData => {
                if (companyData.branch) {
                    Object.values(companyData.branch).forEach(branchData => {
                        if (branchData.item) {
                            totalCount += Object.keys(branchData.item).length;
                        }
                    });
                }
            });
        });

        return totalCount;    
    } catch (error) {
        console.error('❌ Error fetching total item count:', error);
        throw error;
    }
}

async function getItemCompanyCount(Com) { 
    let count = 0;
        try {
            const documents = await Modal.find({}); //ข้อมูลในCollection
            console.log(documents[0][Com]["branch"]);
            Object.entries(documents[0][Com]["branch"]).map(([key, value]) => {
                console.log(value.item);
                count += Object.entries(value.item).length;
            })
            return count;    
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }

    }


    async function getItemBranchCount(Com, Bran) { 
        try {
            const documents = await Modal.find({}).lean(); // ดึงข้อมูลจาก MongoDB
            let count = 0;
    
            if (documents[0][Com] && documents[0][Com].branch[Bran]) {
                count = Object.keys(documents[0][Com].branch[Bran].item || {}).length;
            }
    
            return count;    
        } catch (error) {
            console.error('❌ Error fetching branch item count:', error);
            throw error;
        }
    }

// โหลดข้อมูลจากไฟล์ JSON

router.get('/', async (req, res) => {
        

        // Object.entries(filedata).map(([key, value]) => {
        //     count += getItemCompanyCount(key);
        // });
        const count = await getAllItems();
        res.json({count});

});

router.get('/:Com', async (req, res) => {
    const Com = req.params.Com;
    const count = await getItemCompanyCount(Com);
    res.json({count})
    
})


router.get('/:Com/:Bran', async (req, res) => { 
    const { Com, Bran } = req.params;
    const count = await getItemBranchCount(Com, Bran);
    res.json({ branchItemCount: count });
});

module.exports = router;