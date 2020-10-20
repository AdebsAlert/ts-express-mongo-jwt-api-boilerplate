import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { db } from './util/db';
import { PORT, APP, NODE_ENV } from './util/config';
import { userRouter } from './modules/user/routes';
import { logger } from './util/logger';

const app: express.Express = express();

app.set('port', PORT || 4000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({}));

app.get('/v1/status', (_req, res) => {
  res.send(`${APP} is healthy`);
});

app.use('/v1/user', userRouter);

db.on('connected', () => {
  logger.info(`${NODE_ENV} database connected`);
});

export { app };
