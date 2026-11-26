'use strict';

const { celebrate } = require('celebrate');

function validate(schemas) {
  return celebrate(schemas, { abortEarly: false });
}

module.exports = validate;
