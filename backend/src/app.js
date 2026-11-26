'use strict';

const express = require('express');

const {
  applySecurity,
  errorHandler,
  notFound,
  requestLogger,
} = require('./middlewares');
const routes = require('./routes');
const { HTTP_STATUS } = require('./config/constants');

const app = express();

applySecurity(app);

app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    host: req.get('host'),
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
