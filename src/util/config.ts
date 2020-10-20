import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config({});

function throwIfUndefined<T>(secret: T | undefined, name?: string): T {
  if (!secret) {
    logger.error(`${name} must not be undefined`);
    return process.exit(1);
  }
  return secret;
}

export const PORT = throwIfUndefined(process.env.PORT, 'PORT');
export const APP = throwIfUndefined(process.env.APP, 'APP');
export const NODE_ENV = throwIfUndefined(process.env.NODE_ENV, 'NODE_ENV');
export const MONGOURI = throwIfUndefined(process.env.MONGOURI, 'MONGOURI');
export const MONGOTESTURI = throwIfUndefined(process.env.MONGOTESTURI, 'MONGOTESTURI');
export const APP_SECRET = throwIfUndefined(process.env.APP_SECRET, 'APP_SECRET');
export const REDIS_HOST = throwIfUndefined(process.env.REDIS_HOST, 'REDIS_HOST');
export const MAILGUN_API_KEY = throwIfUndefined(process.env.MAILGUN_API_KEY, 'MAILGUN_API_KEY');
export const MAILGUN_DOMAIN = throwIfUndefined(process.env.MAILGUN_DOMAIN, 'MAILGUN_DOMAIN');
export const MAILGUN_FROM_EMAIL = throwIfUndefined(process.env.MAILGUN_FROM_EMAIL, 'MAILGUN_FROM_EMAIL');
export const MAILGUN_FROM_TITLE = throwIfUndefined(process.env.MAILGUN_FROM_TITLE, 'MAILGUN_FROM_TITLE');
