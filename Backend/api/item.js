const express = require('express');
const router = express.Router();
const itemModel = require('./DB/item.js');

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function getAllItems() {
    try {
        const doc = await itemModel.find({}, { _id: 0 }).lean()
        const data = doc.flatMap(doc => {
            return doc
        })
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getAllItemCount() {
    try {
        const doc = await itemModel.find({}, { _id: 0 }).lean();
        return doc.length;
    } catch (error) {
        console.error('Error fetching total item count:', error);
        return 0;
    }
}

async function getItemCompany(Com) {
    try {
        const doc = await itemModel.find({ "item_client": Com }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc;
        }
        return [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemCompanyCount(Com) {
    try {
        const doc = await itemModel.find({ "item_client": Com }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc.length;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getItemCompanyBranch(Com, Bran) {
    try {
        const doc = await itemModel.find({ "item_client": Com, "item_client_branch": Bran }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc;
        }
        return [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemBranchCount(Com, Bran) {
    try {
        const doc = await itemModel.find({ "item_client": Com, "item_client_branch": Bran }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc.length;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getItemInfo(Com, Bran, Id) {
    try {
        const doc = await itemModel.find({ "item_client": Com, "item_client_branch": Bran, "item_id": Id }, { _id: 0 }).lean();
        return doc;

    } catch (error) {
        console.error('Error fetching item details:', error);
        return null;
    }
}

async function createItem(Data) {
    try {
        const lastItem = await itemModel.findOne().sort({ item_id: -1 }).lean();
        if (!lastItem) return "TH-2025-0000001";
        const lastNumber = parseInt(lastItem.item_id.split('-').pop());
        const newItem = {
            "item_id": `TH-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`,
            "item_client": Data.item_client || "ThaiBev",
            "item_client_branch": Data.item_client_branch || "ThaiBev_1",
            "item_brand": Data.item_brand || "Chubb",
            "item_capacity": Data.item_capacity || "9kg",
            "item_color": Data.item_color || "red",
            "item_type": Data.item_type || "foam",
            "item_class": Data.item_class || "ABC"
        };
        await itemModel.create(newItem);
        return true;

    } catch (error) {
        console.error("Error adding new item:", error);
        return false;
    }
}

async function updateItem(Id, Data) {
    try {
        const doc = await itemModel.findOne({ "item_id": Id });
        if (!doc) {
            return false;
        }
        doc.set({
            "item_id": doc["item_id"],
            "item_client": doc["item_client"],
            "item_client_branch": doc["item_client_branch"],
            "item_brand": Data.item_brand || doc["item_brand"],
            "item_capacity": Data.item_capacity || doc["item_capacity"],
            "item_color": Data.item_color || doc["item_color"],
            "item_type": Data.item_type || doc["item_type"],
            "item_class": Data.item_class || doc["item_class"]
        });
        await doc.save();
        return true;
    } catch (error) {
        console.error("Error adding new item:", error);
        return false;
    }
}

async function deleteItem(Com, Bran, Id) {
    try {
        const doc = await CompanyModel.findOne({ [`${Com}`]: { $exists: true } });
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
});

router.get('/getAllItem/count', async (req, res) => {
    try {
        const count = await getAllItemCount();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching all items:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

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
})

router.get('/getItemList/count/:Com', async (req, res) => {
    const Com = req.params.Com;
    try {
        const count = await getItemCompanyCount(Com);
        res.json({ count })
    } catch (error) {
        console.error('Error fetching item company count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
})

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
})

router.get('/getItemList/count/:Com/:Bran', async (req, res) => {
    const { Com, Bran } = req.params;
    try {
        const count = await getItemBranchCount(Com, Bran);
        res.json({ branchItemCount: count });
    } catch (error) {
        console.error('Error fetching item branch count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
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
            message: 'Error fetching item details'
        });
    }
});

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

router.put('/updateItem/:company/:branch/:id', async (req, res) => {
    try {
        const { company, branch, id } = req.params;
        const data = req.body;
        const item = await updateItem(company, branch, id, data);
        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating item'
        });
    }
});

router.put('/updateItemLog/:company/:branch/:id/:name/:data', async (req, res) => {
    try {
        const { company, branch, id, name, data } = req.params;
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