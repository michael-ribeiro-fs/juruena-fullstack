'use strict';

const express = require('express');

const { userController } = require('../controllers');
const { auth, asyncHandler } = require('../middlewares');

const router = express.Router();

router.get('/me', auth, asyncHandler(userController.getMe));

module.exports = router;
