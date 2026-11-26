'use strict';

const notFound = require('../../../src/middlewares/notFound');
const { NotFoundError } = require('../../../src/errors');

describe('middlewares/notFound', () => {
  it('chama next com NotFoundError contendo método e URL', () => {
    const req = { method: 'GET', originalUrl: '/api/inexistente' };
    const next = jest.fn();
    notFound(req, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Rota não encontrada: GET /api/inexistente');
  });
});
