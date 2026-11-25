'use strict';

const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require('../../../src/errors');

describe('errors/AppError', () => {
  const cases = [
    { Cls: BadRequestError, status: 400 },
    { Cls: UnauthorizedError, status: 401 },
    { Cls: ForbiddenError, status: 403 },
    { Cls: NotFoundError, status: 404 },
    { Cls: ConflictError, status: 409 },
  ];

  it('AppError base recebe statusCode e marca isOperational', () => {
    const err = new AppError('erro', 418);
    expect(err.statusCode).toBe(418);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('erro');
    expect(err).toBeInstanceOf(Error);
  });

  cases.forEach(({ Cls, status }) => {
    it(`${Cls.name} tem statusCode ${status} e é instanceof AppError`, () => {
      const err = new Cls('mensagem');
      expect(err.statusCode).toBe(status);
      expect(err.message).toBe('mensagem');
      expect(err).toBeInstanceOf(AppError);
      expect(err).toBeInstanceOf(Error);
      expect(err.isOperational).toBe(true);
    });
  });
});
