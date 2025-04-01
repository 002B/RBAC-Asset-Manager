const express = require('express');
const router = express.Router();
const CompanyModel = require('./DB/companyModal.js');

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function getAllItems() {
    try {
        const documents = await CompanyModel.find({}, { _id: 0 }).lean()
        //console.log(documents);

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

async function getAllItemCount() {
    let totalCount = 0;
    try {
        const documents = await CompanyModel.find({}, { _id: 0 }).lean();
        // console.log(documents);

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
        console.error('Error fetching total item count:', error);
        return 0;
    }
}

async function getItemCompany(Com) {
    try {
        const documents = await CompanyModel.find({ [`${Com}`]: { $exists: true } }, { [`${Com}`]: 1, _id: 0 }).lean();
        // console.log(documents[0][Com]);
        
        const transformedData = documents.flatMap(doc => {
            return Object.entries(doc).flatMap(([key, value]) => {
                return Object.entries(value.branch).flatMap(([branchName, branchData]) => {
                    return [branchData.item]
                });
            });
        });

        return transformedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemCompanyCount(Com) {
    let count = 0;
    try {
        const documents = await CompanyModel.find({ [`${Com}`]: { $exists: true } }, { [`${Com}`]: 1, _id: 0 }).lean();
        // console.log(documents[0][Com]);

        Object.entries(documents[0][Com]["branch"]).map(([key, value]) => {
            count += Object.entries(value.item).length;
        })
        return count;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getItemCompanyBranch(Com, Bran) {
    try {
        const documents = await CompanyModel.find({ [`${Com}`]: { $exists: true } }, { [`${Com}`]: 1, _id: 0 }).lean();
        return documents[0][Com]["branch"][Bran]["item"];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemBranchCount(Com, Bran) {
    let count = 0;
    try {
        const documents = await CompanyModel.find({ [`${Com}.branch.${Bran}`]: { $exists: true } }, { [`${Com}.branch.${Bran}`]: 1, _id: 0 }).lean();
        count = Object.keys(documents[0][Com].branch[Bran].item || {}).length;

        return count;
    } catch (error) {
        console.error('Error fetching branch item count:', error);
        return 0
    }
}

async function getItemInfo(Com, Bran, Id) {
    try {
        const documents = await CompanyModel.find({ [`${Com}.branch.${Bran}.item.${Id}`]: { $exists: true } }, { [`${Com}.branch.${Bran}.item.${Id}`]: 1, _id: 0 }).lean();

        const itemData = documents[0][Com].branch[Bran].item[Id];
        
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

async function createItem(Com, Bran, Id, Data) {
    try {
        const doc = await CompanyModel.findOne({ [`${Com}`] : { $exists: true } });
        doc.set(`${Com}.branch.${Bran}.item.${Id}`, Data);
        await doc.save();
        return true
    } catch (error) {
        return false
    }
}

async function updateItemLog(Com, Bran, Id, Name, Data) {
    try {
        const doc = await CompanyModel.findOne({ [`${Com}`] : { $exists: true } });
        doc.set(`${Com}.branch.${Bran}.item.${Id}.log.${Name}`, Data);
        await doc.save();
        return true
    } catch (error) {
        return false
    }
}

async function deleteItem(Com, Bran, Id) {
    try {
        const doc = await CompanyModel.findOne({ [`${Com}`] : { $exists: true } });
        delete doc[Com].branch[Bran].item[Id];
        doc.markModified(Com); 
        await doc.save();
        return true
    } catch (error) {
        return false
    }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

router.get('/getAllItem', async (req, res) => {
    try {
        const items = await getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
}); //

router.get('/getAllItem/count', async (req, res) => {
    try {
        const count = await getAllItemCount();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching all items:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
}); //

router.get('/getItemList/:Com', async (req, res) => {
    const Com = req.params.Com;
    try {
        const items = await getItemCompany(Com);
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
}) //

router.get('/getItemList/count/:Com', async (req, res) => {
    const Com = req.params.Com;
    try {
        const count = await getItemCompanyCount(Com);
        res.json({ count })
    } catch (error) {
        console.error('Error fetching item company count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
}) //

router.get('/getItemList/:Com/:Bran', async (req, res) => {
    const { Com, Bran } = req.params;
    try {
        const items = await getItemCompanyBranch(Com, Bran);
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
}) //

router.get('/getItemList/count/:Com/:Bran', async (req, res) => {
    const { Com, Bran } = req.params;
    try {
        const count = await getItemBranchCount(Com, Bran);
        res.json({ branchItemCount: count });
    } catch (error) {
        console.error('Error fetching item branch count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
}); //


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
            message: 'Error fetching item details'
        });
    }
}); //

router.post('/createItem/:company/:branch/:id', async (req, res) => {
    try {
        const { company, branch, id } = req.params;
        const data = req.body;
        const item = await createItem(company, branch, id, data);
        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating item'
        });
    }
});

router.put('/updateItemLog/:company/:branch/:id/:name/:data', async (req, res) => {
    try {
        const { company, branch, id, name, data} = req.params;
        const item = await updateItemLog(company, branch, id, name, data);
        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating item'
        });
    }
});

router.delete('/deleteItem/:company/:branch/:id', async (req, res) => {
    try {
        const { company, branch, id } = req.params;
        const item = await deleteItem(company, branch, id);
        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting item'
        });
    }
});

module.exports = router;