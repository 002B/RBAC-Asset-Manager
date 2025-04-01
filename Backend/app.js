const express = require('express');
const cors = require('cors');
const connectDB = require('./api/DB/DB');
const app = express();
const port = 3000;

connectDB();

const getUser = require('./api/getUser');
const user = require('./api/userapi');

const log = require('./api/log');
const item = require('./api/item');
const company = require('./api/company');
// const Test = require('./api/DB/companyModal');

// async function addFireExtinguisherToSCB2() {
//   try {

//     // ข้อมูลถังดับเพลิงใหม่ที่จะเพิ่ม
//     const newExtinguisher = {
//         "brand": "SafetyPlus",
//         "type": "Fire Extinguisher",
//         "capacity": "9kg",
//         "install_by": "TechTeam",
//         "install_date": "15/08/2023",
//         "exp_date": "15/08/2026",
//         "location": "Server Room 2",
//         "color": "Blue",
//         "next_check": "15/08/2024",
//         "last_check": "15/08/2023",
//         "status": "Good",
//         "log": {
//           "Install": "15/08/2023"
//         }
//     };


// const doc = await Test.findOne({ "SCB": { $exists: true } });

// doc.set('SCB.branch.SCB_2.item.FXT-2023-106', newExtinguisher);

// const saved = await doc.save();
// console.log('Saved successfully:', saved);

// const check = await Test.findOne({ _id: doc._id }).lean();
// console.log('Verified:', check.SCB.branch.SCB_2.item["FXT-2023-105"]);

// //////////////////////////////////////////////////////////////
// doc.set('SCB.branch.SCB_2.item.FXT-2023-105.status' , "Bad");
// await doc.save();


//     await Test.findOneAndUpdate(
//       { "SCB": { $exists: true } },
//       { 
//         $set: { 
//           "SCB.branch.SCB_2.item.FXT-2023-105": newExtinguisher 
//         } 
//       },
//       { new: true }
//     )
//   } catch (error) {
//     console.error('เกิดข้อผิดพลาด:', error.message);
//   }
// }

// addFireExtinguisherToSCB2();
app.use(cors());
app.use(express.json());
//
app.use('/getUser', getUser);
app.use('/company', company);
app.use('/log', log);
app.use('/item', item);
app.use('/user', user);
app.use('/reportbox', require('./api/reportlogapi'));


app.get('/api/items', async (req, res) => {
  try {
    const { transformCompanyData } = require('./api/itemModel');
    const items = await transformCompanyData();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});