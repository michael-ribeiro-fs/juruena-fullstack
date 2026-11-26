'use strict';

const { Joi } = require('celebrate');

const favoriteParamsSchema = {
  params: Joi.object({
    placeId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = { favoriteParamsSchema };
