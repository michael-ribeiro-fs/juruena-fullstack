'use strict';

const { Favorite, Place } = require('../models');
const { NotFoundError, ForbiddenError, ConflictError } = require('../errors');
const { ERROR_MESSAGES } = require('../config/constants');

async function listFavorites(req, res) {
  const favorites = await Favorite.find({ user: req.user._id }).populate(
    'place',
  );
  res.status(200).json(favorites);
}

async function addFavorite(req, res) {
  const { placeId } = req.params;

  const place = await Place.findById(placeId);
  if (!place) {
    throw new NotFoundError(ERROR_MESSAGES.PLACE_NOT_FOUND);
  }

  const existing = await Favorite.findOne({
    user: req.user._id,
    place: placeId,
  });
  if (existing) {
    throw new ConflictError(ERROR_MESSAGES.FAVORITE_ALREADY_EXISTS);
  }

  const favorite = await Favorite.create({
    user: req.user._id,
    place: placeId,
  });
  await favorite.populate('place');
  res.status(201).json(favorite);
}

async function removeFavorite(req, res) {
  const { placeId } = req.params;
  const favorite = await Favorite.findOne({
    user: req.user._id,
    place: placeId,
  });

  if (!favorite) {
    throw new NotFoundError(ERROR_MESSAGES.FAVORITE_NOT_FOUND);
  }

  // Defesa em profundidade (a query já filtra por user)
  if (favorite.user.toString() !== req.user._id.toString()) {
    throw new ForbiddenError(ERROR_MESSAGES.FAVORITE_FORBIDDEN);
  }

  await favorite.deleteOne();
  res.status(200).json(favorite);
}

module.exports = { listFavorites, addFavorite, removeFavorite };
