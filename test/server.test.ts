import request from 'supertest';
import { app } from '../src/index';

describe('Server health check', () => {
  it('should return 200 if server is alive', async done => {
    const response = await request(app).get('/v1/status');
    expect(response.status).toEqual(200);
    done();
  });
});
