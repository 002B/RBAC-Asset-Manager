const express = require('express');
const cors = require('cors');
const connectDB = require('./api/DB/DB');
const app = express();
const port = 3000;

connectDB();
// const Test = require('./api/DB/companyModal');
// async function test(Com) {
//   try {
//     const result = await Test.findOne(
//         { [`${Com}`]: { $exists: true } },
//         { [`${Com}`]: 1, _id: 0 }
//     ).lean();

//     console.log(Object.keys(result[Com]["branch"]));
// } catch (error) {
//     console.error('Error fetching log reports:', error);
//     return 0;
// }
// }
// test("ThaiBev");

const getItem = require('./api/getItem');
const getUser = require('./api/getUser');
const log = require('./api/log');
const item = require('./api/getItemDetail');
const user = require('./api/userapi');
const branch = require('./api/exportExcel');


app.use(cors());
app.use(express.json());


app.use('/getItem', getItem);
app.use('/getUser', getUser);
app.use('/branch', branch);
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