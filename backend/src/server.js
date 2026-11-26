'use strict';

const app = require('./app');
const { validateEnv, PORT, isProduction } = require('./config/env');
const { connectDatabase } = require('./config/database');
const logger = require('./logger');

async function start() {
  try {
    validateEnv();
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
  });

  try {
    await connectDatabase();
  } catch (error) {
    logger.error('Falha ao conectar ao MongoDB', { error: error.message });
    if (isProduction) {
      logger.error('Encerrando processo (produção exige banco conectado)');
      process.exit(1);
    }
    logger.warn('Modo desenvolvimento: servidor continua sem banco.');
  }
}

start();
