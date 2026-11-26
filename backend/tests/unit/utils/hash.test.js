'use strict';

const { hashPassword, comparePassword } = require('../../../src/utils/hash');

describe('utils/hash', () => {
  describe('hashPassword', () => {
    it('retorna uma string diferente da senha original', async () => {
      const password = 'senhaSegura123';
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
    });

    it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
      const password = 'senhaSegura123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });

    it('retorna hash no formato bcrypt ($2a$10$...)', async () => {
      const hash = await hashPassword('teste');
      expect(hash).toMatch(/^\$2[ab]\$\d{2}\$/);
    });
  });

  describe('comparePassword', () => {
    it('retorna true para senha correta', async () => {
      const password = 'senhaSegura123';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('retorna false para senha incorreta', async () => {
      const password = 'senhaSegura123';
      const hash = await hashPassword(password);
      const result = await comparePassword('senhaErrada', hash);
      expect(result).toBe(false);
    });
  });
});
