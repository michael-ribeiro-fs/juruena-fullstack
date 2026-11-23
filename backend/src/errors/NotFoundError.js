'use strict';

const { HTTP_STATUS } = require('../config/constants');
const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

module.exports = NotFoundError;
