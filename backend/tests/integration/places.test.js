'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { User, Place, Favorite } = require('../../src/models');

const adminData = {
  name: 'Admin',
  email: 'admin@test.com',
  password: 'senhaForte123',
};
const userData = {
  name: 'User',
  email: 'user@test.com',
  password: 'senhaForte123',
};

const validPlace = {
  slug: 'praca-do-lago',
  image: 'https://exemplo.com/praca.jpg',
  alt: 'Praça do Lago',
  tag: 'Lazer',
  location: 'Centro',
  title: 'Praça do Lago',
  description: 'Estrutura de lazer no centro da cidade.',
};

async function getAdminToken() {
  await request(app).post('/api/signup').send(adminData);
  await User.updateOne({ email: adminData.email }, { role: 'admin' });
  const res = await request(app).post('/api/signin').send({
    email: adminData.email,
    password: adminData.password,
  });
  return res.body.token;
}

async function getUserToken() {
  await request(app).post('/api/signup').send(userData);
  const res = await request(app).post('/api/signin').send({
    email: userData.email,
    password: userData.password,
  });
  return res.body.token;
}

describe('GET /api/places', () => {
  it('retorna array vazio quando não há lugares', async () => {
    const res = await request(app).get('/api/places');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retorna lugares sem exigir autenticação', async () => {
    await Place.create(validPlace);
    const res = await request(app).get('/api/places');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].slug).toBe('praca-do-lago');
  });
});

describe('POST /api/places', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).post('/api/places').send(validPlace);
    expect(res.status).toBe(401);
  });

  it('retorna 403 com token de user comum', async () => {
    const token = await getUserToken();
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(validPlace);
    expect(res.status).toBe(403);
  });

  it('retorna 201 com token de admin', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(validPlace);
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.slug).toBe('praca-do-lago');
  });

  it('retorna 400 quando tag inválida', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPlace, tag: 'Inexistente' });
    expect(res.status).toBe(400);
  });

  it('retorna 409 quando slug duplicado', async () => {
    const token = await getAdminToken();
    await Place.create(validPlace);
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(validPlace);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/slug/i);
  });
});

describe('DELETE /api/places/:placeId', () => {
  let placeId;

  beforeEach(async () => {
    const place = await Place.create(validPlace);
    placeId = place._id.toString();
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).delete(`/api/places/${placeId}`);
    expect(res.status).toBe(401);
  });

  it('retorna 403 com token de user comum', async () => {
    const token = await getUserToken();
    const res = await request(app)
      .delete(`/api/places/${placeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('retorna 200 com token de admin e remove o lugar', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .delete(`/api/places/${placeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(placeId);
    const inDb = await Place.findById(placeId);
    expect(inDb).toBeNull();
  });

  it('retorna 404 quando lugar não existe', async () => {
    const token = await getAdminToken();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/places/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('retorna 400 quando placeId inválido', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .delete('/api/places/invalido')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('remove favoritos órfãos ao deletar lugar', async () => {
    const userToken = await getUserToken();
    await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${userToken}`);

    const before = await Favorite.countDocuments({ place: placeId });
    expect(before).toBe(1);

    const adminToken = await getAdminToken();
    await request(app)
      .delete(`/api/places/${placeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    const after = await Favorite.countDocuments({ place: placeId });
    expect(after).toBe(0);
  });
});
