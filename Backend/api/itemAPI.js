const express = require('express');
const router = express.Router();
const itemFunc = require('./item');

// Get all items
router.get('/getAllItem', async (req, res) => {
    try {
        const items = await itemFunc.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Get count of all items
router.get('/getAllItem/count', async (req, res) => {
    try {
        const count = await itemFunc.getAllItemCount();
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item count' });
    }
});

// Get items by company
router.get('/getItemList/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const items = await itemFunc.getItemCompany(company);
        if (!items.length) return res.status(404).json(items);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Get count of items by company
router.get('/getItemList/count/:company', async (req, res) => {
    const { company } = req.params;
    try {
        const count = await itemFunc.getItemCompanyCount(company);
        if (!count) return res.status(404).json(count);
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item count' });
    }
});

// Get items by company and branch
router.get('/getItemList/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const items = await itemFunc.getItemCompanyBranch(company, branch);
        if (!items.length) return res.status(404).json(items);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Get count of items by company and branch
router.get('/getItemList/count/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    try {
        const count = await itemFunc.getItemBranchCount(company, branch);
        if (!count) return res.status(404).json(count);
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item count' });
    }
});

// Get item info by ID
router.get('/getItemInfo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const itemDetails = await itemFunc.getItemInfo(id);
        if (!itemDetails) return res.status(404).json([]);
        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

// Create an item
router.post('/createItem/:company/:branch', async (req, res) => {
    const { company, branch } = req.params;
    const data = req.body;
    try {
        const itemDetails = await itemFunc.createItem(company, branch, data);
        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item' });
    }
});

// Create many items
router.post('/createItem/:company/:branch/:count', async (req, res) => {
    const { company, branch, count } = req.params;
    const data = req.body;
    try {
        const itemDetails = await itemFunc.createManyItem(company, branch, data, count);
        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item' });
    }
});

// Update an item
router.put('/updateItem/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const items = await itemFunc.updateItem(id, data);
        if (!items) return res.status(404).json({ message: 'Item not found' });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item' });
    }
});

// Update item status
router.put('/updateStatus', async (req, res) => {
    const { item_ids, status } = req.body;
    try {
        const updateResult = await itemFunc.updateStatus(item_ids, status);
        if (!updateResult) return res.status(404).json({ message: 'No items found or no updates were made' });
        res.json({ message: `Items updated successfully to ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item status' });
    }
});

// Delete an item
router.delete('/deleteItem/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const items = await itemFunc.deleteItem(id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item' });
    }
});

module.exports = router;
