const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const getItem = require('./api/getItem.js');
const test = require('./api/testapi.js');
const log = require('./api/Log.js');
const item = require('./api/itemDetail.js');

app.use(cors());
app.use(express.json());
app.use('/getItem', getItem);
app.use('/test', test);
app.use('/log', log);
app.use('/item', item);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});