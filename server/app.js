const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const responseHandler = require('./middleware/responseHandler');
const cors = require('cors');
const connectDB = require('./api/DB/DB');
const app = express();
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

connectDB();
const swaggerDocument = YAML.load(path.join(__dirname, './api/Swaggak.yaml'));

const log = require('./api/itemLogAPI');
const item = require('./api/itemAPI');
const company = require('./api/companyAPI');
const report = require('./api/reportAPI');
const activityLog = require('./api/activityLogAPI');
const users = require('./api/usersAPI');
const getImg = require('./api/getImg');
// const Test = require('./api/DB/companyModal');

app.use(cors());
app.use(express.json());
app.use(responseHandler);

const apiRouter = express.Router();
apiRouter.use('/users', users);
apiRouter.use('/company', company);
apiRouter.use('/item', item);
apiRouter.use('/report', report);
apiRouter.use('/itemlog', log);
apiRouter.use('/activitylog', activityLog);
apiRouter.use('/getImage', getImg);
apiRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routes at both /api and root / to support both prefixed and direct access
app.use('/api', apiRouter);
app.use('/', apiRouter);

if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log(`Swagger UI available on http://localhost:${port}/api-docs`);
  });
}

module.exports = app;
