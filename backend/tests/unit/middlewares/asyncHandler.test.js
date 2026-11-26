'use strict';

const asyncHandler = require('../../../src/middlewares/asyncHandler');

describe('middlewares/asyncHandler', () => {
  it('chama o handler com req, res e next', async () => {
    const req = { a: 1 };
    const res = { b: 2 };
    const next = jest.fn();
    const fn = jest.fn().mockResolvedValue();
    await asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('delega erros de promises ao next', async () => {
    const next = jest.fn();
    const error = new Error('falhou');
    const fn = jest.fn().mockRejectedValue(error);
    await asyncHandler(fn)({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('não chama next em sucesso', async () => {
    const next = jest.fn();
    const fn = jest.fn().mockResolvedValue();
    await asyncHandler(fn)({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});
