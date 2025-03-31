const express = require('express');
const cors = require('cors');
const connectDB = require('./api/db');
const app = express();
const port = 3000;

connectDB();


const getItem = require('./api/getItem');
const getUser = require('./api/getUser');
const excel = require('./api/exportExcel');
const log = require('./api/Log');
const item = require('./api/itemDetail');
const user = require('./api/userapi');
const branch = require('./api/exportExcel');


app.use(cors());
app.use(express.json());


app.use('/getItem', getItem);
app.use('/getUser', getUser);
app.use('/branch', branch);
app.use('/export', excel);
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