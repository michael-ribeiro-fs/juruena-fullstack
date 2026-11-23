'use strict';

const env = require('./env');
const constants = require('./constants');
const database = require('./database');

module.exports = {
  ...env,
  ...constants,
  ...database,
};
