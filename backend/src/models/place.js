'use strict';

const mongoose = require('mongoose');

const { PLACE_TAGS } = require('../config/constants');

const placeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug inválido'],
    },
    image: {
      type: String,
      required: [true, 'Imagem é obrigatória'],
      trim: true,
    },
    alt: {
      type: String,
      required: [true, 'Texto alternativo é obrigatório'],
      trim: true,
    },
    tag: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      enum: {
        values: PLACE_TAGS,
        message: 'Categoria inválida',
      },
    },
    location: {
      type: String,
      required: [true, 'Localização é obrigatória'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [2, 'Título deve ter ao menos 2 caracteres'],
      maxlength: [100, 'Título deve ter no máximo 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
      minlength: [10, 'Descrição deve ter ao menos 10 caracteres'],
      maxlength: [500, 'Descrição deve ter no máximo 500 caracteres'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('place', placeSchema);
