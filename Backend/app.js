const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const getItem = require('./api/getItem.js');
const test = require('./api/testapi.js');
const getUser = require('./api/getUser.js');
const excel = require('./api/exportExcel.js');
const log = require('./api/Log.js');
const item = require('./api/itemDetail.js');
const user = require('./api/userapi.js');

app.use(cors());
app.use(express.json());
app.use('/getItem', getItem);
app.use('/test', test);
app.use('/getUser', getUser);

app.use('/export', excel);

app.use('/log', log);
app.use('/item', item);
app.use('/user', user);
app.use('/reportbox', require('./api/reportlogapi.js'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});