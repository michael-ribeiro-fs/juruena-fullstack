'use strict';

const express = require('express');

const { favoriteController } = require('../controllers');
const { auth, asyncHandler, validate } = require('../middlewares');
const { favoriteParamsSchema } = require('../validators/favoriteValidators');

const router = express.Router();

router.use(auth);

router.get('/', asyncHandler(favoriteController.listFavorites));
router.post(
  '/:placeId',
  validate(favoriteParamsSchema),
  asyncHandler(favoriteController.addFavorite),
);
router.delete(
  '/:placeId',
  validate(favoriteParamsSchema),
  asyncHandler(favoriteController.removeFavorite),
);

module.exports = router;
