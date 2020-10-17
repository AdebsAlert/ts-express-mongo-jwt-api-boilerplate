import { app } from './index';
import { logger } from './util/logger';
import { PORT, APP } from './util/config';

const server = app.listen(PORT, () => {
  logger.info(`${APP} is running on ${PORT}`);
});

export { server };
