'use strict';

const mongoose = require('mongoose');

const { MONGO_URI } = require('./env');
const logger = require('../logger');

async function connectDatabase() {
  if (!MONGO_URI) {
    throw new Error(
      'MONGO_URI não definida. Configure o .env antes de conectar ao banco.',
    );
  }

  await mongoose.connect(MONGO_URI);
  logger.info('Conectado ao MongoDB');
}

async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('Desconectado do MongoDB');
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
