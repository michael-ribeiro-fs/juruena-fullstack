'use strict';

require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

function validateEnv() {
  const missing = [];

  if (isProduction) {
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
    if (!process.env.MONGO_URI) missing.push('MONGO_URI');
  }

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes em produção: ${missing.join(', ')}`,
    );
  }
}

const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

module.exports = {
  validateEnv,
  NODE_ENV,
  isProduction,
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  LOG_DIR: process.env.LOG_DIR || './logs',
  CORS_ORIGINS,
};
