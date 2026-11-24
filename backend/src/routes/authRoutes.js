'use strict';

const express = require('express');

const { authController } = require('../controllers');
const { asyncHandler, authLimiter, validate } = require('../middlewares');
const { signupSchema, signinSchema } = require('../validators');

const router = express.Router();

router.post(
  '/signup',
  authLimiter,
  validate(signupSchema),
  asyncHandler(authController.signup),
);

router.post(
  '/signin',
  authLimiter,
  validate(signinSchema),
  asyncHandler(authController.signin),
);

module.exports = router;
