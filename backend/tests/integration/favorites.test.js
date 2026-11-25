'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { Place, Favorite } = require('../../src/models');

const userA = {
  name: 'User A',
  email: 'usera@test.com',
  password: 'senhaForte123',
};
const userB = {
  name: 'User B',
  email: 'userb@test.com',
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

async function createAndLogin(userData) {
  await request(app).post('/api/signup').send(userData);
  const res = await request(app).post('/api/signin').send({
    email: userData.email,
    password: userData.password,
  });
  return res.body.token;
}

describe('GET /api/favorites', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(401);
  });

  it('retorna array vazio quando usuário não tem favoritos', async () => {
    const token = await createAndLogin(userA);
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retorna apenas os favoritos do usuário logado', async () => {
    const tokenA = await createAndLogin(userA);
    const tokenB = await createAndLogin(userB);
    const place = await Place.create(validPlace);

    await request(app)
      .post(`/api/favorites/${place._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    const resA = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(resA.body).toHaveLength(1);

    const resB = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(resB.body).toHaveLength(0);
  });

  it('popula o campo place com objeto completo (não apenas ID)', async () => {
    const token = await createAndLogin(userA);
    const place = await Place.create(validPlace);
    await request(app)
      .post(`/api/favorites/${place._id}`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body).toHaveLength(1);
    expect(typeof res.body[0].place).toBe('object');
    expect(res.body[0].place.slug).toBe('praca-do-lago');
    expect(res.body[0].place.title).toBe('Praça do Lago');
    expect(res.body[0].place.image).toBe(validPlace.image);
  });
});

describe('POST /api/favorites/:placeId', () => {
  let placeId;

  beforeEach(async () => {
    const place = await Place.create(validPlace);
    placeId = place._id.toString();
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).post(`/api/favorites/${placeId}`);
    expect(res.status).toBe(401);
  });

  it('retorna 201 ao favoritar um lugar válido', async () => {
    const token = await createAndLogin(userA);
    const res = await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.place).toBeDefined();
    expect(res.body.place.slug).toBe('praca-do-lago');
  });

  it('retorna 404 quando o lugar não existe', async () => {
    const token = await createAndLogin(userA);
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post(`/api/favorites/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrado/i);
  });

  it('retorna 400 quando placeId inválido (não-hex)', async () => {
    const token = await createAndLogin(userA);
    const res = await request(app)
      .post('/api/favorites/invalido')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('retorna 409 ao favoritar o mesmo lugar duas vezes', async () => {
    const token = await createAndLogin(userA);
    await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${token}`);
    const res = await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/já está/i);
  });

  it('permite dois usuários diferentes favoritarem o mesmo lugar', async () => {
    const tokenA = await createAndLogin(userA);
    const tokenB = await createAndLogin(userB);

    const resA = await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    const resB = await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(resA.status).toBe(201);
    expect(resB.status).toBe(201);

    const count = await Favorite.countDocuments({ place: placeId });
    expect(count).toBe(2);
  });
});

describe('DELETE /api/favorites/:placeId', () => {
  let tokenA;
  let placeId;

  beforeEach(async () => {
    tokenA = await createAndLogin(userA);
    const place = await Place.create(validPlace);
    placeId = place._id.toString();
    await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenA}`);
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).delete(`/api/favorites/${placeId}`);
    expect(res.status).toBe(401);
  });

  it('retorna 200 ao remover favorito próprio', async () => {
    const res = await request(app)
      .delete(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();

    const count = await Favorite.countDocuments({ place: placeId });
    expect(count).toBe(0);
  });

  it('impede user B de deletar favorito de user A (404 + dado preservado)', async () => {
    // A query do controller já filtra por user, então user B não encontra
    // o favorito de user A → 404. O importante é que o dado de A permanece.
    const tokenB = await createAndLogin(userB);
    const res = await request(app)
      .delete(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect([403, 404]).toContain(res.status);

    const count = await Favorite.countDocuments({ place: placeId });
    expect(count).toBe(1);
  });

  it('retorna 404 ao tentar deletar favorito que não possui', async () => {
    const tokenB = await createAndLogin(userB);
    const res = await request(app)
      .delete(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrado/i);
  });

  it('não afeta favoritos de outros usuários ao deletar o próprio', async () => {
    const tokenB = await createAndLogin(userB);
    await request(app)
      .post(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    await request(app)
      .delete(`/api/favorites/${placeId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    const count = await Favorite.countDocuments({ place: placeId });
    expect(count).toBe(1);
  });

  it('retorna 400 quando placeId inválido', async () => {
    const res = await request(app)
      .delete('/api/favorites/invalido')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(400);
  });
});
