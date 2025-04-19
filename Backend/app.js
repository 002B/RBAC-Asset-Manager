const express = require('express');
const cors = require('cors');
const connectDB = require('./api/DB/db');
const app = express();
const port = 3000;

connectDB();

const log = require('./api/itemLogAPI');
const item = require('./api/itemAPI');
const company = require('./api/companyAPI');
const report = require('./api/reportAPI');
const activityLog = require('./api/activityLogAPI');
const users = require('./api/usersAPI');
// const Test = require('./api/DB/companyModal');

app.use(cors());
app.use(express.json());
app.use('/users', users);
app.use('/company', company);
app.use('/item', item);
app.use('/report', report);
app.use('/itemlog', log);
app.use('/activitylog', activityLog);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});