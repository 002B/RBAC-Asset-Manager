const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

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

async function getItemInfo(companyName, branchName, itemId) {
    try {
        const document = await CompanyModel.findOne({
            [`${companyName}.branch.${branchName}.item.${itemId}`]: { $exists: true }
        });

        if (!document) {
            return null;
        }

        const docObject = document.toObject();
        const companyData = docObject[companyName];
        const branchData = companyData.branch[branchName];
        const itemData = branchData.item[itemId];

        return {
            company: companyName,
            branch: branchName,
            id: itemId,
            ...itemData
        };
    } catch (error) {
        console.error('Error fetching item details:', error);
        throw error;
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

router.get('/getItemInfo/:company/:branch/:id', async (req, res) => {
    try {
        const { company, branch, id } = req.params;
        const item = await getItemInfo(company, branch, id);

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
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching item details',
            error: error.message
        });
    }
});

module.exports = router;