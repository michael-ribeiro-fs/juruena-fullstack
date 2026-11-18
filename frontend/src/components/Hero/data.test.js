import { describe, it, expect } from "vitest";

import {
  HERO_PRIMARY_CTA_TO,
  HERO_SECONDARY_CTA_TO,
  HERO_IMAGE_URL,
} from "./data";

describe("Hero — contratos", () => {
  it('CTAs apontam para rotas internas (começam com "/")', () => {
    expect(HERO_PRIMARY_CTA_TO).toMatch(/^\//);
    expect(HERO_SECONDARY_CTA_TO).toMatch(/^\//);
  });

  it("imagem tem URL válida (começa com http)", () => {
    expect(HERO_IMAGE_URL).toMatch(/^https?:\/\//);
  });
});
