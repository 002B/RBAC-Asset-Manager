const express = require('express');
const router = express.Router();
const Modal = require('./DB/companyModal.js');

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function getAllItemCount() {
    let totalCount = 0;
    try {
        const documents = await Modal.find({}).lean();

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

async function getItemCompanyCount(Com) {
    let count = 0;
    try {
        const documents = await Modal.find({ [`${Com}`]: { $exists: true } }, { [`${Com}`]: 1, _id: 0 }).lean();
        Object.entries(documents[Com]["branch"]).map(([key, value]) => {
            count += Object.entries(value.item).length;
        })
        return count;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}


async function getItemBranchCount(Com, Bran) {
    let count = 0;
    try {
        const documents = await Modal.find({ [`${Com}.branch.${Bran}`]: { $exists: true } }, { [`${Com}.branch.${Bran}`]: 1, _id: 0 }).lean();

        if (documents[Com] && documents[Com].branch[Bran]) {
            count = Object.keys(documents[Com].branch[Bran].item || {}).length;
        }

        return count;
    } catch (error) {
        console.error('Error fetching branch item count:', error);
        return 0
    }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {
    try {
        const count = await getAllItemCount();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching all items:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

router.get('/:Com', async (req, res) => {
    const Com = req.params.Com;
    try {
        const count = await getItemCompanyCount(Com);
        res.json({ count })
    } catch (error) {
        console.error('Error fetching item company count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }

})


router.get('/:Com/:Bran', async (req, res) => {
    const { Com, Bran } = req.params;
    try {
        const count = await getItemBranchCount(Com, Bran);
        res.json({ branchItemCount: count });
    } catch (error) {
        console.error('Error fetching item branch count:', error);
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

module.exports = router;