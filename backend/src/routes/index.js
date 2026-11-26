'use strict';

const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoutes = require('./placeRoutes');
const favoriteRoutes = require('./favoriteRoutes');

const router = express.Router();

router.use(authRoutes);
router.use('/users', userRoutes);
router.use('/places', placeRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;
