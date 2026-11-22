'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

module.exports = async () => {
  if (!process.env.MONGO_URI_TEST) {
    throw new Error('MONGO_URI_TEST não definida no .env');
  }
  await mongoose.connect(process.env.MONGO_URI_TEST);
};
