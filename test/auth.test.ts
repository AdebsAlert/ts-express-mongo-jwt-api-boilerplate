import request from 'supertest';
import randomstring from 'randomstring';
import { app } from '../src/index';

const email = `${randomstring.generate({ length: 7 })}@gmail.com`;
const password = `${randomstring.generate({ length: 8 })}`;

let jwt: string;

describe('Sign up', () => {
  it('should register a user', async done => {
    const res = await request(app)
      .post('/v1/user/auth/register')
      .send({
        email,
        password,
      });
    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    done();
  });

  it('should not register a user when email is missing', async done => {
    const res = await request(app)
      .post('/v1/user/auth/register')
      .send({
        password: 'testPass',
      });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
    done();
  });

  it('should not register an already existing user', async done => {
    const res = await request(app)
      .post('/v1/user/auth/register')
      .send({
        email,
        password: 'testPass.',
      });
    expect(res.status).toEqual(401);
    expect(res.body.success).toBe(false);
    done();
  });
});

describe('User Login', () => {
  it('should log in with valid credentials', async done => {
    const res = await request(app)
      .post('/v1/user/auth/login')
      .send({ email, password });
    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    jwt = res.body.data.token;
    console.log(jwt);
    done();
  });

  it('should fail with invalid credentials', async done => {
    const res = await request(app)
      .post('/v1/user/auth/login')
      .send({ email, password: 'testP' });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
    done();
  });

  it('should fail with missing credentials', async done => {
    const res = await request(app)
      .post('/v1/user/auth/login')
      .send({ email });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
    done();
  });
});
