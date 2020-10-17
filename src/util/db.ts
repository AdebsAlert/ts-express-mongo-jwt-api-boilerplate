import mongoose from 'mongoose';
import { MONGOURI } from './config';
import { logger } from './logger';

require('dotenv').config();

const options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose
  .connect(MONGOURI, options)
  .then(() => logger.info('database connected'))
  .catch(error => {
    logger.error(error);
    process.exit(1);
  });

export const db = mongoose.connection;
