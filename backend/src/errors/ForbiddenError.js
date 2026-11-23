'use strict';

const { HTTP_STATUS } = require('../config/constants');
const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
