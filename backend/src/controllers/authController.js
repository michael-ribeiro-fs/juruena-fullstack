'use strict';

const { User } = require('../models');
const { signToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError } = require('../errors');
const { ERROR_MESSAGES } = require('../config/constants');

async function signup(req, res) {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  // A senha é hasheada pelo hook pre('save') do model User.
  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

async function signin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = signToken({ _id: user._id.toString() });

  res.status(200).json({ token });
}

module.exports = {
  signup,
  signin,
};
