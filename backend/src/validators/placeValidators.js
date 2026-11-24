'use strict';

const { Joi } = require('celebrate');

const { PLACE_TAGS } = require('../config/constants');

const createPlaceSchema = {
  body: Joi.object({
    slug: Joi.string().required(),
    image: Joi.string().uri().required(),
    alt: Joi.string().required(),
    tag: Joi.string()
      .valid(...PLACE_TAGS)
      .required(),
    location: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }).unknown(false),
};

const placeIdSchema = {
  params: Joi.object({
    placeId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = { createPlaceSchema, placeIdSchema };
