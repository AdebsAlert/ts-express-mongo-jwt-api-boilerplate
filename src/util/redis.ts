import redis from 'redis';
import util from 'util';

import { REDIS_HOST, APP } from './config';
import { USER_TOKEN_EXPIRATION_IN_MILLISECONDS } from './constants';

const client = redis.createClient(REDIS_HOST);

client.on('connect', () => {
  console.log('Connected to Redis!');
});

const asyncClient = {
  get: util.promisify(client.get).bind(client),
  set: util.promisify(client.set).bind(client),
  hdel: util.promisify(client.hdel).bind(client),
  hget: util.promisify(client.hget).bind(client),
  hmset: util.promisify(client.hmset).bind(client),
  hmget: util.promisify(client.hmget).bind(client),
  hmgetall: util.promisify(client.hgetall).bind(client),
  expire: util.promisify(client.expire).bind(client),
  del: util.promisify(client.del).bind(client),
  incr: util.promisify(client.incr).bind(client),
  ttl: util.promisify(client.ttl).bind(client),
};

function getRedisKey(key: string) {
  return `${APP}-${key}`;
}

async function saveMultipleItemsInRedis(key: string, records: Array<string>) {
  if (records.length % 2 !== 0) {
    throw new Error('Invalid number of arguments for HMSET');
  }
  await asyncClient.hmset([key, ...records]);
  return await asyncClient.expire(key, USER_TOKEN_EXPIRATION_IN_MILLISECONDS);
}

export { asyncClient, getRedisKey, client, saveMultipleItemsInRedis };
