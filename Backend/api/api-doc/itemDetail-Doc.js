const express = require('express');
const router = express.Router();
const company = require('../../data/company.json');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Item Detail API',
            version: '1.0.0',
            description: 'API for managing and retrieving item details',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [__filename],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs-itemDetail', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /getAllItem:
 *   get:
 *     summary: Retrieve all items
 *     responses:
 *       200:
 *         description: A list of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   company:
 *                     type: string
 *                   branch:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get('/getAllItem', (req, res) => {
    const items = getAllItem();
    res.json(items);
});

/**
 * @swagger
 * /getItemInfo/{company}/{branch}/{id}:
 *   get:
 *     summary: Retrieve item information by company, branch, and ID
 *     parameters:
 *       - in: path
 *         name: company
 *         required: true
 *         schema:
 *           type: string
 *         description: The company name
 *       - in: path
 *         name: branch
 *         required: true
 *         schema:
 *           type: string
 *         description: The branch name
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Com:
 *                   type: string
 *                 Bran:
 *                   type: string
 *                 ID:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Item not found
 */
router.get('/getItemInfo/:company/:branch/:id', (req, res) => {
    const { company, branch, id } = req.params;
    const item = getItemInfo(company, branch, id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

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

module.exports = router;
