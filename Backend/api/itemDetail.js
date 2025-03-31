const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const company = require('../data/company.json');
const COLLECTION_NAME = 'company';


const CompanyModel = mongoose.model(
    COLLECTION_NAME,
    new mongoose.Schema({}, { strict: false }),
    COLLECTION_NAME
);

async function getAllItems() {
    try {

        const documents = await CompanyModel.find({});

        const transformedData = documents.flatMap(doc => {
            return Object.entries(doc.toObject()).flatMap(([companyName, companyData]) => {
                if (companyName === '_id') return [];
                return Object.entries(companyData.branch).flatMap(([branchName, branchData]) => {
                    return Object.entries(branchData.item).map(([itemId, itemData]) => ({
                        id: itemId,
                        company: companyName,
                        branch: branchName,
                        ...itemData
                    }));
                });
            });
        });
        
        return transformedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


function getItemInfo(Com, Bran, ID) {
    if (company[Com] && company[Com].branch[Bran] && company[Com].branch[Bran].item[ID]) {
        return {
            Com,
            Bran,
            ID,
            ...company[Com].branch[Bran].item[ID]
        };
    } else {
        return null;
    }
}


router.get('/getAllItem', async (req, res) => {
    try {
        const items = await getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching items',
            error: error.message 
        });
    }
});


router.get('/getItemInfo/:company/:branch/:id', (req, res) => {
    const { company, branch, id } = req.params;
    const item = getItemInfo(company, branch, id);
    
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ 
            message: 'Item not found',
            details: {
                company: company,
                branch: branch,
                id: id
            }
        });
    }
});

module.exports = router;