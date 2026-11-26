'use strict';

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Usuário é obrigatório'],
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'place',
      required: [true, 'Lugar é obrigatório'],
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ user: 1, place: 1 }, { unique: true });

module.exports = mongoose.model('favorite', favoriteSchema);
