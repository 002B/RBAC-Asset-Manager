const express = require('express');
const router = express.Router();
const company = require('../data/company.json');

function getAllItem() {
    return Object.entries(company).map(([key, value]) => {
        return Object.entries(value.branch).map(([branchKey, branchValue]) => {
            return Object.entries(branchValue.item).map(([itemKey, itemValue]) => {
                return {
                    id: itemKey,
                    company: key,
                    branch: branchKey,
                    ...itemValue
                };
            });
        });
    }).flat(2);
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

router.get('/getAllItem', (req, res) => {
    const items = getAllItem();
    res.json(items);
});

router.get('/getItemInfo/:company/:branch/:id', (req, res) => {
    const { company, branch, id } = req.params;
    const item = getItemInfo(company, branch, id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

module.exports = router;
