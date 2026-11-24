'use strict';

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { NODE_ENV, CORS_ORIGINS } = require('../config/env');

const isTest = NODE_ENV === 'test';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: 'Muitas requisições. Tente novamente em 15 minutos.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    message:
      'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  },
});

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requests sem Origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (CORS_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

function applySecurity(app) {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(globalLimiter);
}

module.exports = {
  applySecurity,
  authLimiter,
};
