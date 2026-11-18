import { describe, it, expect } from 'vitest';

import { HEADER_NAV_LINKS } from './data';

describe('HEADER_NAV_LINKS — contratos', () => {
  it('tem exatamente 3 links', () => {
    expect(HEADER_NAV_LINKS).toHaveLength(3);
  });

  it('todos os links têm id único', () => {
    const ids = HEADER_NAV_LINKS.map((link) => link.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it('todos os links internos começam com "/"', () => {
    HEADER_NAV_LINKS.forEach((link) => {
      expect(link.to).toMatch(/^\//);
    });
  });
});
