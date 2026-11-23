'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');

const { LOG_DIR, NODE_ENV } = require('../config/env');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'request.log'),
    }),
  ],
});

if (NODE_ENV !== 'production' && NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

module.exports = logger;
