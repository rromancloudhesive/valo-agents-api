const express = require('express');
const serverless = require('serverless-http');
const errorHandler = require('./src/middlewares/error-middleware.js');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

exports.handler = serverless(app);
exports.app = app;