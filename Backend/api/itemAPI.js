const express = require('express');
const router = express.Router();
const itemFunc = require('./item');


/*
 ‌‌‍⁡⁢⁢⁢𝗚𝗘𝗧⁡​
*/
router.get('/getAllItem', async (req, res) => {
    try {
        const items = await itemFunc.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
});


/*
⁡⁢⁢⁢​‌‌‍𝗚𝗘𝗧​⁡
*/
router.get('/getAllItem/count', async (req, res) => {
    try {
        const count = await itemFunc.getAllItemCount();
        res.json( count );
    } catch (error) {
        console.error('Error fetching all items:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
});


/*
⁡⁢⁢⁢​‌‌‍𝗚𝗘𝗧​⁡
*/
router.get('/getItemList/:company', async (req, res) => {
    try {
        const company = req.params.company;
        if (!company) return res.status(404).json({ message: 'Company not found' });



        const items = await itemFunc.getItemCompany(company);
        if (items.length === 0) {
            return res.status(404).json(items);
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
})


/*
⁡⁢⁢⁢​‌‌‍𝗚𝗘𝗧​⁡
*/
router.get('/getItemList/count/:company', async (req, res) => {
    try {
        const company = req.params.company;
        if (!company) return res.status(404).json({ message: 'Company not found' });



        const count = await itemFunc.getItemCompanyCount(company);
        if (count === 0) {
            return res.status(404).json(count);
        }
        res.json(count)
    } catch (error) {
        console.error('Error fetching item company count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
})


/*
 ‌‌‍⁡⁢⁢⁢𝗚𝗘𝗧⁡​
*/
router.get('/getItemList/:company/:branch', async (req, res) => {
    try {
        const { company, branch } = req.params;
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (!branch) return res.status(404).json({ message: 'Branch not found' });



        const items = await itemFunc.getItemCompanyBranch(company, branch);
        if (items.length === 0) {
            return res.status(404).json(items);
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items'
        });
    }
})


/*
 ‌‌‍⁡⁢⁢⁢𝗚𝗘𝗧⁡​
*/
router.get('/getItemList/count/:company/:branch', async (req, res) => {
    try {
        const { company, branch } = req.params;
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (!branch) return res.status(404).json({ message: 'Branch not found' });



        const count = await itemFunc.getItemBranchCount(company, branch);
        if (count === 0) {
            return res.status(404).json(count);
        }
        res.json({ count });
    } catch (error) {
        console.error('Error fetching item branch count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
});


/*
⁡⁢⁢⁢​‌‌‍𝗚𝗘𝗧​⁡
*/
router.get('/getItemInfo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(404).json({ message: 'ID not found' });



        const itemDetails = await itemFunc.getItemInfo(id);
        if (itemDetails) {
            res.json(itemDetails);
        } else {
            res.status(404).json([]);
        }
    } catch (error) {
        console.error('Error fetching item details:', error);
        res.status(500).json({ message: 'Error fetching item details', error: error.message });
    }
});


/*
 ‌‌‍⁡⁣⁣⁢‍POST​​⁡ ⁡⁣⁣⁡⁣⁣⁢(𝗖𝗿𝗲𝗮𝘁𝗲 𝗜𝘁𝗲𝗺‍‍)⁡
*/
router.post('/createItem/:company/:branch', async (req, res) => {
    try {
        const { company, branch } = req.params;
        const data = req.body;
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        if (!data) return res.status(404).json({ message: 'Data not found' });
        if (!data.item_client || !data.item_client_branch || !data.item_brand || !data.item_capacity || !data.item_color || !data.item_type || !data.item_class) return res.status(404).json({ message: 'Incomplete data' });



        const itemDetails = await itemFunc.createItem(company, branch, data);
        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating item'
        });
    }
});


/*
 ‌‌‍⁡⁣⁣⁢POST​ (Create Many Item)⁡
*/
router.post('/createItem/:company/:branch/:count', async (req, res) => {
    try {
        const { company, branch, count } = req.params;
        const data = req.body;
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        if (!count) return res.status(404).json({ message: 'Count not found' });
        if (!data) return res.status(404).json({ message: 'Data not found' });
        if (!data.item_client || !data.item_client_branch || !data.item_brand || !data.item_capacity || !data.item_color || !data.item_type || !data.item_class) return res.status(404).json({ message: 'Incomplete data' });



        const itemDetails = await itemFunc.createManyItem(company, branch, data, count);
        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating item'
        });
    }
});


/*
⁡⁣⁢⁣​‌‌‍PUT​ (𝗨𝗽𝗱𝗮𝘁𝗲 𝗜𝘁𝗲𝗺)⁡
*/
router.put('/updateItem/:company/:branch/:id', async (req, res) => {
    try {
        const { company, branch, id } = req.params;
        const data = req.body;
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        if (!id) return res.status(404).json({ message: 'ID not found' });
        if (!data) return res.status(404).json({ message: 'Data not found' });



        const items = await itemFunc.updateItem(company, branch, id, data);
        if (!items) return res.status(404).json({ message: 'Item not found' });
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating item'
        });
    }
});


/*
⁡⁣⁢⁣​‌‌‍𝗣𝗨𝗧​ (𝗨𝗽𝗱𝗮𝘁𝗲 𝗦𝘁𝗮𝘁𝘂𝘀)⁡
*/
router.put('/updateStatus', async (req, res) => { 
    try {
        const { item_ids, status } = req.body;

        if (!Array.isArray(item_ids) || item_ids.length === 0) {
            return res.status(400).json({ message: 'Item IDs are required and should be an array' });
        }

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['pending', 'reporting', 'accepted', 'fixing', 'done'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updateResult = await updateStatus(item_ids, status);

        if (!updateResult) {
            return res.status(404).json({ message: 'No items found or no updates were made' });
        }

        res.json({ message: `Items updated successfully to ${status}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            message: 'Error updating item status'
        });
    }
});

/*
⁡⁢⁣⁢​‌‌‍DELETE​⁡ ⁡⁢⁣⁢(𝗗𝗲𝗹𝗲𝘁𝗲 𝗜𝘁𝗲𝗺)⁡
*/
router.delete('/deleteItem/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'ID not found' });

        const items = await itemFunc.deleteItem(id);
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting item'
        });
    }
});

module.exports = router;