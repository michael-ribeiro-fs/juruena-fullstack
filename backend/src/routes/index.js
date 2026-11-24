'use strict';

const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoutes = require('./placeRoutes');

const router = express.Router();

router.use(authRoutes);
router.use('/users', userRoutes);
router.use('/places', placeRoutes);

module.exports = router;
