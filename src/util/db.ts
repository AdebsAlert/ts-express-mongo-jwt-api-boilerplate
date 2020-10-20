import mongoose from 'mongoose';
import { MONGOURI, MONGOTESTURI, NODE_ENV } from './config';
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

const dbCon = NODE_ENV === 'test' ? MONGOTESTURI : MONGOURI;
mongoose
  .connect(dbCon, options)
  .then(() => logger.info(`${NODE_ENV} database connected`))
  .catch(error => {
    logger.error(error);
    process.exit(1);
  });

export const db = mongoose.connection;
