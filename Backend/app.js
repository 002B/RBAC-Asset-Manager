const express = require('express');
const cors = require('cors');
const connectDB = require('./api/DB/db');
const app = express();
const port = 3000;

connectDB();

const log = require('./api/log');
const item = require('./api/itemAPI');
const company = require('./api/company');
const report = require('./api/reportAPI');
const activityLog = require('./api/activity_log');
const users = require('./api/usersAPI');
// const Test = require('./api/DB/companyModal');

app.use(cors());
app.use(express.json());
app.use('/users', users);
app.use('/company', company);
app.use('/log', log);
app.use('/item', item);
app.use('/report', report);
app.use('/activitylog', activityLog);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});