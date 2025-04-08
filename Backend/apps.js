const connectDB = require('./api/DB/db');

connectDB();


const itemModel = require('./api/DB/item');
async function test(Id, Data) {
  try {
    const doc = await itemModel.findOne({"item_id": Id });
    console.log(doc);
    
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
test("TH-2025-000001",{"item_brand": "Chubb", "item_capacity": "4kg", "item_color": "red", "item_type": "foam", "item_class": "ABC"});
