const itemModel = require('./DB/item.js');


async function updateStatus(id,status) {
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getAllItems() {
    try {
        const doc = await itemModel.find({}, { _id: 0 }).lean()
        return doc;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getAllItemCount() {
    try {
        const doc = await itemModel.find({}, { _id: 0 }).lean();
        return doc.length;
    } catch (error) {
        console.error('Error fetching total item count:', error);
        return 0;
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getItemCompany(company) {
    try {
        const doc = await itemModel.find({ "client_id": company }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc;
        }
        return [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getItemCompanyCount(company) {
    try {
        const doc = await itemModel.find({ "client_id": company }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc.length;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getItemCompanyBranch(company, branch) {
    try {
        const doc = await itemModel.find({ "client_id": company, "client_branch_id": branch }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc;
        }
        return [];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getItemBranchCount(company, branch) {
    try {
        const doc = await itemModel.find({ "client_id": company, "client_branch_id": branch }, { _id: 0 }).lean();
        if (doc.length > 0) {
            return doc.length;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}


/*
​‌‌‍⁡⁢⁢⁢‍𝗚𝗘𝗧⁡​
*/
async function getItemInfo(id) {
    try {
        const doc = await itemModel.findOne({ "item_id": id }, { _id: 0 }).lean();
        if (!doc) {
            return null;
        }
        return doc;
    } catch (error) {
        console.error('Error fetching item details:', error);
        return null;
    }
}


/*
​‌‌‍‍⁡⁣⁣⁢‍POST⁡​ ⁡⁣⁣⁡⁣⁣⁢(𝗖𝗿𝗲𝗮𝘁𝗲 𝗜𝘁𝗲𝗺‍‍)⁡
*/
async function createItem(company, branch, data) {
    try {
        const lastItem = await itemModel.find({}).lean();
        if (lastItem.length === 0) return "TH-2025-0000001";
        const lastNumber = parseInt(lastItem[lastItem.length - 1].item_id.split('-').pop());

        await itemModel.create({
            "item_id": `TH-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`,
            "client_id": company,
            "client_branch_id": branch,
            "item_brand": data.item_brand,
            "item_capacity": data.item_capacity,
            "item_color": data.item_color,
            "item_type": data.item_type,
            "item_class": data.item_class
        });
        return `TH-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`;
    } catch (error) {
        console.error("Error adding new item:", error);
        return false;
    }
}



/*
​‌‌‍‍‍⁡⁣⁣⁢POST​ (Create Many Item)⁡
*/
async function createManyItem(company, branch, data, count) {
    try {
        const lastItem = await itemModel.find({}).lean();
        if (lastItem.length === 0) return "TH-2025-0000001";
        let lastNumber = parseInt(lastItem[lastItem.length - 1].item_id.split('-').pop());
        for (let i = 0; i < count; i++) {
            lastNumber++;
            await itemModel.create({
                "item_id": `TH-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`,
                "client_id": company,
                "client_branch_id": branch,
                "item_brand": data.item_brand,
                "item_capacity": data.item_capacity,
                "item_color": data.item_color,
                "item_type": data.item_type,
                "item_class": data.item_class,
                "item_status": "Available" //Good Report Bad Fix
            });
        }
        return true;
    } catch (error) {
        console.error("Error adding new item:", error);
        return false;
    }
}


/*
⁡⁣⁢⁣​‌‌‍PUT​ (𝗨𝗽𝗱𝗮𝘁𝗲 𝗜𝘁𝗲𝗺)⁡
*/
async function updateItem(id, data) {
    try {
        const doc = await itemModel.findOne({ "item_id": id });
        if (!doc) {
            return false;
        }
        doc.set({
            "item_id": doc["item_id"],
            "client_id": doc["item_client"],
            "client_branch_id": doc["item_client_branch"],
            "item_brand": data.item_brand || doc["item_brand"],
            "item_capacity": data.item_capacity || doc["item_capacity"],
            "item_color": data.item_color || doc["item_color"],
            "item_type": data.item_type || doc["item_type"],
            "item_class": data.item_class || doc["item_class"],
            "item_status": data.item_status
        });
        await doc.save();
        return true;
    } catch (error) {
        return false
    }
}


async function updateItemLog(Com, Bran, Id, Data) {
    try {
        const doc = await CompanyModel.findOne({ [`${Com}.branch.${Bran}.item.${Id}`] : { $exists: true } });
        doc.set(`${Com}.branch.${Bran}.item.${Id}`, Data);
        await doc.save();
        return true
    } catch (error) {
        return false
    }
}

/*
​‌‌‍⁡⁢⁣⁢‍DELETE⁡​ ⁡⁢⁣⁢(𝗗𝗲𝗹𝗲𝘁𝗲 𝗜𝘁𝗲𝗺)⁡
*/
async function deleteItem(id) {
    try {
        const doc = await itemModel.deleteOne({ "item_id": id });
        if (doc.deletedCount === 0) {
            return false;
        }
        return true
    } catch (error) {
        return false
    }
}

module.exports = { getAllItems, getAllItemCount, getItemCompany, getItemCompanyCount, getItemCompanyBranch, getItemBranchCount, getItemInfo, createItem, createManyItem, updateItem, deleteItem };
