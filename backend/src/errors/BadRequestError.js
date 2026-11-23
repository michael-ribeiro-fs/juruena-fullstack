'use strict';

const { HTTP_STATUS } = require('../config/constants');
const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
