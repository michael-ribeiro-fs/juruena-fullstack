'use strict';

const { Joi } = require('celebrate');

const signupSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).unknown(false),
};

const signinSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(false),
};

module.exports = {
  signupSchema,
  signinSchema,
};
