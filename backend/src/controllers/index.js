'use strict';

const authController = require('./authController');
const userController = require('./userController');
const placeController = require('./placeController');
const favoriteController = require('./favoriteController');

module.exports = {
  authController,
  userController,
  placeController,
  favoriteController,
};
