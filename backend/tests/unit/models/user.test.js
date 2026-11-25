'use strict';

const { User } = require('../../../src/models');

describe('models/user — hook pre-save', () => {
  it('não re-hasheia a senha quando o campo não é modificado', async () => {
    const user = await User.create({
      name: 'Test',
      email: 'hook@test.com',
      password: 'senhaOriginal123',
    });

    const originalHash = user.password;

    user.name = 'Test Updated';
    await user.save();

    expect(user.password).toBe(originalHash);
  });

  it('hasheia a senha novamente quando o campo é modificado', async () => {
    const user = await User.create({
      name: 'Test',
      email: 'hook2@test.com',
      password: 'senhaOriginal123',
    });

    const originalHash = user.password;

    user.password = 'novaSenha456';
    await user.save();

    expect(user.password).not.toBe(originalHash);
    expect(user.password).toMatch(/^\$2[ab]\$\d{2}\$/);
  });
});
