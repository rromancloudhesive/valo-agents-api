const express = require('express');
const serverless = require('serverless-http');
const errorHandler = require('./middlewares/error-middleware.js');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

app.listen(4000, () => {
  console.log('running on port 4000');
})

exports.handler = serverless(app);
exports.app = app;