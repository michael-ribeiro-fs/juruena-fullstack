'use strict';

const auth = require('./auth');
const asyncHandler = require('./asyncHandler');
const checkAdmin = require('./checkAdmin');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const { applySecurity, authLimiter } = require('./security');
const validate = require('./validate');

module.exports = {
  auth,
  asyncHandler,
  checkAdmin,
  errorHandler,
  notFound,
  applySecurity,
  authLimiter,
  validate,
};
