const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

async function getAllItems() {
    try {
        const documents = await CompanyModel.find({}).lean()
        const transformedData = documents.flatMap(doc => {
            return Object.entries(doc).flatMap(([key, value]) => {
                if (key === '_id' || !value || typeof value !== 'object' || !value.branch) {
                    return [];
                }
                return Object.entries(value.branch).flatMap(([branchName, branchData]) => {
                    return Object.entries(branchData.item).map(([itemId, itemData]) => ({
                        id: itemId,
                        company: key,
                        branch: branchName,
                        ...(itemData || {})
                    }));
                });
            });
        });

        return transformedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


async function getItemInfo(Com, Bran, Id) {
    try {
        const result = await CompanyModel.aggregate([
            { $match: { [`${Com}.branch.${Bran}.item.${Id}`]: { $exists: true } } },
            { $project: { 
                itemData: `$${Com}.branch.${Bran}.item.${Id}`,
                _id: 0
            }}
        ]);

        if (result.length === 0) {
            console.log('Item not found');
            return null;
        }

        const itemData = result[0].itemData;
        
        return {
            company: Com,
            branch: Bran,
            id: Id,
            ...itemData
        };
    } catch (error) {
        console.error('Error fetching item details:', error);
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