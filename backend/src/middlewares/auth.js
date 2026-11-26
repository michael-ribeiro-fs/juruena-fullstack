'use strict';

const asyncHandler = require('./asyncHandler');
const { UnauthorizedError } = require('../errors');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const { ERROR_MESSAGES } = require('../config/constants');

const auth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_NOT_PROVIDED);
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch (verifyError) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  const user = await User.findById(payload._id);
  if (!user) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  req.user = user;
  next();
});

module.exports = auth;
