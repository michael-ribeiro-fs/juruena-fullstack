'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setupFilesAfterEnv.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/**/index.js',
    '!src/config/database.js',
    '!src/config/env.js',
    '!src/logger/logger.js',
    '!src/middlewares/requestLogger.js',
    '!src/middlewares/security.js',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80,
    },
  },
  clearMocks: true,
  verbose: true,
  maxWorkers: 1,
};
