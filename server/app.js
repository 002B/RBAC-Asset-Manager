const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const responseHandler = require('./middleware/responseHandler');
const cors = require('cors');
const connectDB = require('./api/DB/DB');
const app = express();
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

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

// Ensure DB connection before processing requests
app.use(async (req, res, next) => {
  // Allow health check and swagger docs without blocking on DB
  if (req.path.includes('/api-docs') || req.path.endsWith('/health')) {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed on request:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    mongoConnectionState: mongoose.connection.readyState,
  });
});

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
