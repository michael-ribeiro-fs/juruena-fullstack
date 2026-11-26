'use strict';

const mongoose = require('mongoose');

const auth = require('../../../src/middlewares/auth');
const { signToken } = require('../../../src/utils/jwt');
const { User } = require('../../../src/models');

async function createUser(overrides = {}) {
  return User.create({
    name: 'Test User',
    email: 'auth@test.com',
    password: 'senhaForte123',
    ...overrides,
  });
}

function makeReq(headers = {}) {
  return { headers };
}

describe('middlewares/auth', () => {
  it('retorna 401 quando não há header Authorization', async () => {
    const next = jest.fn();
    await auth(makeReq(), {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Token não fornecido',
      }),
    );
  });

  it('retorna 401 quando Authorization não é Bearer', async () => {
    const next = jest.fn();
    await auth(makeReq({ authorization: 'Basic abc' }), {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
  });

  it('retorna 401 para token inválido', async () => {
    const next = jest.fn();
    await auth(
      makeReq({ authorization: 'Bearer token.invalido.aqui' }),
      {},
      next,
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Token inválido' }),
    );
  });

  it('retorna 401 quando o usuário do token não existe mais', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const token = signToken({ _id: fakeId });
    const next = jest.fn();
    await auth(makeReq({ authorization: `Bearer ${token}` }), {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
  });

  it('injeta req.user e chama next sem erro para token válido', async () => {
    const user = await createUser();
    const token = signToken({ _id: user._id.toString() });
    const req = makeReq({ authorization: `Bearer ${token}` });
    const next = jest.fn();
    await auth(req, {}, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(user._id.toString());
    expect(req.user.email).toBe('auth@test.com');
  });
});
