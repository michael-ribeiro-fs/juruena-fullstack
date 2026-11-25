'use strict';

const errorHandler = require('../../../src/middlewares/errorHandler');
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require('../../../src/errors');

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function makeReq() {
  return { originalUrl: '/api/test', method: 'GET' };
}

describe('middlewares/errorHandler', () => {
  it('retorna statusCode e mensagem para AppError (BadRequest)', () => {
    const err = new BadRequestError('requisição inválida');
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'requisição inválida' });
  });

  it('retorna 401 para UnauthorizedError', () => {
    const res = makeRes();
    errorHandler(
      new UnauthorizedError('não autorizado'),
      makeReq(),
      res,
      jest.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retorna 403 para ForbiddenError', () => {
    const res = makeRes();
    errorHandler(new ForbiddenError('proibido'), makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('retorna 404 para NotFoundError', () => {
    const res = makeRes();
    errorHandler(
      new NotFoundError('nao encontrado'),
      makeReq(),
      res,
      jest.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 409 para ConflictError', () => {
    const res = makeRes();
    errorHandler(new ConflictError('conflito'), makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('retorna 400 para CelebrateError (details é Map)', () => {
    const err = new Error('Validation failed');
    err.details = new Map();
    err.details.set('body', {
      details: [{ message: '"name" is required' }],
    });
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: '"name" is required' });
  });

  it('retorna 400 para SyntaxError (JSON malformado)', () => {
    const err = new SyntaxError('Unexpected token');
    err.status = 400;
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'JSON inválido no corpo da requisição',
    });
  });

  it('retorna 413 para payload grande', () => {
    const err = new Error('too large');
    err.type = 'entity.too.large';
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('retorna 409 para E11000 (duplicate key)', () => {
    const err = new Error('duplicate');
    err.code = 11000;
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('retorna 400 para CastError (ID inválido)', () => {
    const err = new Error('Cast to ObjectId failed');
    err.name = 'CastError';
    const res = makeRes();
    errorHandler(err, makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 500 como fallback para erro desconhecido', () => {
    const res = makeRes();
    errorHandler(new Error('erro qualquer'), makeReq(), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
