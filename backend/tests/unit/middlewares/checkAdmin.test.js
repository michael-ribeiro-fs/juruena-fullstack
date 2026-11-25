'use strict';

const checkAdmin = require('../../../src/middlewares/checkAdmin');

describe('middlewares/checkAdmin', () => {
  it('chama next sem erro quando req.user.role === "admin"', () => {
    const next = jest.fn();
    checkAdmin({ user: { role: 'admin' } }, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('retorna 403 quando req.user.role === "user"', () => {
    const next = jest.fn();
    checkAdmin({ user: { role: 'user' } }, {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: 'Acesso restrito a administradores',
      }),
    );
  });

  it('retorna 403 quando não há req.user', () => {
    const next = jest.fn();
    checkAdmin({}, {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 }),
    );
  });
});
