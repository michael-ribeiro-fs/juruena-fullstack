// Testes de contrato das constantes do Footer.

import { describe, it, expect } from 'vitest';

import { FOOTER_NAV_LINKS } from './data';

describe('FOOTER_NAV_LINKS — contratos', () => {
  it('tem exatamente 3 links', () => {
    expect(FOOTER_NAV_LINKS).toHaveLength(3);
  });

  it('todos os links internos começam com "/"', () => {
    FOOTER_NAV_LINKS.forEach((link) => {
      expect(link.to).toMatch(/^\//);
    });
  });
});
