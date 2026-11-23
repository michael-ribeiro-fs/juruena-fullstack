'use strict';

const express = require('express');

const { authController } = require('../controllers');
const { asyncHandler, validate } = require('../middlewares');
const { signupSchema, signinSchema } = require('../validators');

const router = express.Router();

router.post(
  '/signup',
  validate(signupSchema),
  asyncHandler(authController.signup),
);

router.post(
  '/signin',
  validate(signinSchema),
  asyncHandler(authController.signin),
);

module.exports = router;
