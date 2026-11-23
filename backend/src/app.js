'use strict';

const express = require('express');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    host: req.get('host'),
  });
});

module.exports = app;
