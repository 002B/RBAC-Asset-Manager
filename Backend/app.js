const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const test = require('./api/testapi.js');
const user = require('./api/getUser.js');
const excel = require('./api/exportExcel.js');

app.use(cors());
app.use(express.json());

app.use('/test', test);
app.use('/user', user);

app.use('/export', excel);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});