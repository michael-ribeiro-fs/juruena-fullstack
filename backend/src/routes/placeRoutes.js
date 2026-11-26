'use strict';

const express = require('express');

const { placeController } = require('../controllers');
const {
  auth, checkAdmin, asyncHandler, validate,
} = require('../middlewares');
const {
  createPlaceSchema,
  placeIdSchema,
} = require('../validators/placeValidators');

const router = express.Router();

router.get('/', asyncHandler(placeController.listPlaces));
router.post(
  '/',
  auth,
  checkAdmin,
  validate(createPlaceSchema),
  asyncHandler(placeController.createPlace),
);
router.delete(
  '/:placeId',
  auth,
  checkAdmin,
  validate(placeIdSchema),
  asyncHandler(placeController.deletePlace),
);

module.exports = router;
