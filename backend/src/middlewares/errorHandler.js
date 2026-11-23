'use strict';

const { AppError } = require('../errors');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');
const logger = require('../logger');

function isCelebrateError(err) {
  if (err.name === 'CelebrateError') return true;
  if (err.constructor && err.constructor.name === 'CelebrateError') return true;
  if (err.details instanceof Map && err.details.size > 0) return true;
  return false;
}

function extractCelebrateMessage(err) {
  if (!(err.details instanceof Map)) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }
  const firstEntry = err.details.values().next().value;
  const validationError = firstEntry && firstEntry.details && firstEntry.details[0];
  return validationError
    ? validationError.message
    : ERROR_MESSAGES.VALIDATION_ERROR;
}

function normalizeError(err) {
  if (err instanceof AppError) {
    return { message: err.message, statusCode: err.statusCode };
  }
  if (isCelebrateError(err)) {
    return {
      message: extractCelebrateMessage(err),
      statusCode: HTTP_STATUS.BAD_REQUEST,
    };
  }
  if (err.name === 'ValidationError') {
    return { message: err.message, statusCode: HTTP_STATUS.BAD_REQUEST };
  }
  if (err.name === 'CastError') {
    return { message: 'ID inválido', statusCode: HTTP_STATUS.BAD_REQUEST };
  }
  if (err.name === 'SyntaxError' && err.status === 400) {
    return {
      message: 'JSON inválido no corpo da requisição',
      statusCode: HTTP_STATUS.BAD_REQUEST,
    };
  }
  if (err.type === 'entity.too.large') {
    return { message: 'Corpo da requisição muito grande', statusCode: 413 };
  }
  if (err.code === 11000) {
    return {
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      statusCode: HTTP_STATUS.CONFLICT,
    };
  }
  return {
    message: ERROR_MESSAGES.INTERNAL_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };
}

function errorHandler(err, req, res, _next) {
  const { message, statusCode } = normalizeError(err);

  if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(message, { stack: err.stack, url: req.originalUrl });
  }

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
