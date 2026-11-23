'use strict';

const express = require('express');

const { errorHandler, notFound } = require('./middlewares');
const routes = require('./routes');
const { HTTP_STATUS } = require('./config/constants');

const app = express();

app.use(express.json());

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
