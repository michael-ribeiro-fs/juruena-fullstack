'use strict';

const auth = require('./auth');
const asyncHandler = require('./asyncHandler');
const checkAdmin = require('./checkAdmin');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const requestLogger = require('./requestLogger');
const { applySecurity, authLimiter } = require('./security');
const validate = require('./validate');

module.exports = {
  auth,
  asyncHandler,
  checkAdmin,
  errorHandler,
  notFound,
  requestLogger,
  applySecurity,
  authLimiter,
  validate,
};
