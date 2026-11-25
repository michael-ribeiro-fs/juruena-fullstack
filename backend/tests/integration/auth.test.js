'use strict';

const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');

const validSignup = {
  name: 'Michael Ribeiro',
  email: 'michael@example.com',
  password: 'senhaForte123',
};

describe('POST /api/signup', () => {
  it('cria usuário com dados válidos e retorna 201', async () => {
    const res = await request(app).post('/api/signup').send(validSignup);
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe('Michael Ribeiro');
    expect(res.body.email).toBe('michael@example.com');
    expect(res.body.role).toBe('user');
    expect(res.body.password).toBeUndefined();
  });

  it('armazena senha com hash bcrypt no DB', async () => {
    await request(app).post('/api/signup').send(validSignup);
    const user = await User.findOne({ email: validSignup.email }).select(
      '+password',
    );
    expect(user.password).toMatch(/^\$2[ab]\$\d{2}\$/);
    expect(user.password).not.toBe(validSignup.password);
  });

  it('retorna 400 quando body vazio', async () => {
    const res = await request(app).post('/api/signup').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('retorna 400 quando email inválido', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ ...validSignup, email: 'invalido' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 quando password curto', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ ...validSignup, password: '123' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 quando há campo desconhecido (role)', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ ...validSignup, role: 'admin' });
    expect(res.status).toBe(400);
  });

  it('retorna 409 quando email duplicado', async () => {
    await request(app).post('/api/signup').send(validSignup);
    const res = await request(app).post('/api/signup').send(validSignup);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/cadastrado/i);
  });
});

describe('POST /api/signin', () => {
  beforeEach(async () => {
    await request(app).post('/api/signup').send(validSignup);
  });

  it('retorna 200 e JWT com credenciais válidas', async () => {
    const res = await request(app).post('/api/signin').send({
      email: validSignup.email,
      password: validSignup.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split('.')).toHaveLength(3);
  });

  it('retorna 401 quando senha errada', async () => {
    const res = await request(app).post('/api/signin').send({
      email: validSignup.email,
      password: 'senhaErrada',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorretos/i);
  });

  it('retorna 401 quando email não cadastrado', async () => {
    const res = await request(app).post('/api/signin').send({
      email: 'naoexiste@example.com',
      password: 'qualquer',
    });
    expect(res.status).toBe(401);
  });

  it('retorna 400 quando body inválido', async () => {
    const res = await request(app).post('/api/signin').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/me', () => {
  let token;

  beforeEach(async () => {
    await request(app).post('/api/signup').send(validSignup);
    const res = await request(app).post('/api/signin').send({
      email: validSignup.email,
      password: validSignup.password,
    });
    token = res.body.token;
  });

  it('retorna 200 com dados do usuário logado', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe('Michael Ribeiro');
    expect(res.body.email).toBe('michael@example.com');
    expect(res.body.role).toBe('user');
    expect(res.body.password).toBeUndefined();
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('retorna 401 com token malformado', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalido.aqui.ja');
    expect(res.status).toBe(401);
  });
});
