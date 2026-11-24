'use strict';

const authValidators = require('./authValidators');
const placeValidators = require('./placeValidators');
const favoriteValidators = require('./favoriteValidators');

module.exports = {
  ...authValidators,
  ...placeValidators,
  ...favoriteValidators,
};
