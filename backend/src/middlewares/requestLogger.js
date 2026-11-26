'use strict';

const fs = require('fs');
const path = require('path');
const expressWinston = require('express-winston');
const winston = require('winston');

const { LOG_DIR, NODE_ENV } = require('../config/env');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const requestLogTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'request.log'),
});

const requestLogger = expressWinston.logger({
  transports: [requestLogTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  skip: () => NODE_ENV === 'test',
});

module.exports = requestLogger;
