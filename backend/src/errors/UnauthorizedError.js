'use strict';

const { HTTP_STATUS } = require('../config/constants');
const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
