const express = require('express');
const cors = require('cors');
const connectDB = require('./api/DB/DB');
// const Test = require('./api/DB/test_schema');
const app = express();
const port = 3000;

connectDB();
// async function test() {
//   try {
//     const documents = await Test.find({}, {'ThaiBev.branch.ThaiBev_1.item': 1});
//     console.log(JSON.stringify(documents, null, 2));
//     return 
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }


// test();

const getItem = require('./api/getItem');
const getUser = require('./api/getUser');
const log = require('./api/Log');
const item = require('./api/itemDetail');
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