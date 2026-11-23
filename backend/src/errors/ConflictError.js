'use strict';

const { HTTP_STATUS } = require('../config/constants');
const AppError = require('./AppError');

class ConflictError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

module.exports = ConflictError;
