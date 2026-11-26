'use strict';

const { ForbiddenError } = require('../errors');
const { ERROR_MESSAGES } = require('../config/constants');

function checkAdmin(req, _res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ForbiddenError(ERROR_MESSAGES.ADMIN_ONLY));
  }
  return next();
}

module.exports = checkAdmin;
