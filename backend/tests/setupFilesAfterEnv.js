'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

beforeAll(async () => {
  if (!process.env.MONGO_URI_TEST) {
    throw new Error('MONGO_URI_TEST não definida no .env');
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      serverSelectionTimeoutMS: 2000,
    });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
});
