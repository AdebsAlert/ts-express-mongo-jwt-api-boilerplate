import request from 'supertest';
import { app } from '../src/index';
import { db } from '../src/util/db';

describe('Server health check', () => {
  it('should return 200 if server is alive', async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
  });
});

afterAll(async () => {
  await db.dropDatabase();
  await db.close();
});
