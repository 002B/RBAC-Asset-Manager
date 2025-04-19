const itemModel = require('./DB/item.js');

async function getAllItems() {
    try {
        return await itemModel.find({}, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getAllItemCount() {
    try {
        return await itemModel.countDocuments();
    } catch (error) {
        console.error('Error fetching total item count:', error);
        return 0;
    }
}

async function getItemCompany(company) {
    try {
        return await itemModel.find({ client_id: company }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemCompanyCount(company) {
    try {
        return await itemModel.countDocuments({ client_id: company });
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getItemCompanyBranch(company, branch) {
    try {
        return await itemModel.find({ client_id: company, client_branch_id: branch }, { _id: 0 }).lean();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getItemBranchCount(company, branch) {
    try {
        return await itemModel.countDocuments({ client_id: company, client_branch_id: branch });
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}

async function getItemInfo(id) {
    try {
        return await itemModel.findOne({ item_id: id }, { _id: 0 }).lean() || null;
    } catch (error) {
        console.error('Error fetching item details:', error);
        return null;
    }
}

async function checkItemExist(id) {
    try {
        return await itemModel.findOne({ item_id: id });
    } catch (error) {
        console.error('Error fetching item details:', error);
        return false;
    }
}


async function createManyItem(company, branch, data, count) {
    try {
        let lastItem = await itemModel.countDocuments({ "item_id": { $regex: `TH-${new Date().getFullYear()}`, $options: "i" } });
        const items = [];

        for (let i = 0; i < count; i++) {
            lastItem++;
            items.push({
                item_id: `TH-${new Date().getFullYear()}-${lastItem.toString().padStart(7, '0')}`,
                client_id: company,
                client_branch_id: branch,
                item_brand: data.item_brand,
                item_capacity: data.item_capacity,
                item_color: data.item_color,
                item_type: data.item_type,
                item_class: data.item_class,
                item_status: "Available"
            });
        }
        await itemModel.insertMany(items);
        return items;
    } catch (error) {
        console.error("Error adding new items:", error);
        return false;
    }
}

async function updateItem(id, data) {
    try {
        const doc = await itemModel.findOne({ item_id: id });
        if (!doc) return false;

        doc.set({
            item_brand: data.item_brand || doc.item_brand,
            item_capacity: data.item_capacity || doc.item_capacity,
            item_color: data.item_color || doc.item_color,
            item_type: data.item_type || doc.item_type,
            item_class: data.item_class || doc.item_class,
            item_status: data.item_status || doc.item_status
        });
        await doc.save();
        return doc.item_id;
    } catch (error) {
        console.error('Error updating item:', error);
        return false;
    }
}

async function deleteItem(id) {
    try {
        const result = await itemModel.deleteOne({ item_id: id });
        return result.deletedCount > 0 ? id : false;
    } catch (error) {
        console.error('Error deleting item:', error);
        return false;
    }
}
async function updateStatus(itemIds, itemStatus) {
    try {
        const result = await itemModel.updateMany(
            { 
                item_id: { $in: itemIds },
                item_status: { $ne: itemStatus }
            },
            { 
                $set: { item_status: itemStatus } 
            }
        );


        return result.modifiedCount > 0 ? [itemIds[0], itemStatus] : false;
    } catch (error) {
        console.error('Error updating item status:', error);
        return false;
    }
}


module.exports = { 
    getAllItems, 
    getAllItemCount, 
    getItemCompany, 
    getItemCompanyCount, 
    getItemCompanyBranch, 
    getItemBranchCount, 
    getItemInfo,
    checkItemExist,
    createManyItem, 
    updateItem, 
    deleteItem, 
    updateStatus
};

