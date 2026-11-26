'use strict';

const { Place, Favorite } = require('../models');
const { ConflictError, NotFoundError } = require('../errors');
const { ERROR_MESSAGES } = require('../config/constants');

async function listPlaces(req, res) {
  const places = await Place.find({});
  res.status(200).json(places);
}

async function createPlace(req, res) {
  const existing = await Place.findOne({ slug: req.body.slug });
  if (existing) {
    throw new ConflictError(ERROR_MESSAGES.PLACE_ALREADY_EXISTS);
  }
  const place = await Place.create(req.body);
  res.status(201).json(place);
}

async function deletePlace(req, res) {
  const place = await Place.findByIdAndDelete(req.params.placeId);
  if (!place) {
    throw new NotFoundError(ERROR_MESSAGES.PLACE_NOT_FOUND);
  }
  // Integridade referencial: remove favoritos órfãos
  await Favorite.deleteMany({ place: place._id });
  res.status(200).json(place);
}

module.exports = { listPlaces, createPlace, deletePlace };
