"use strict";

const {
  createPlaceSchema,
  placeIdSchema,
} = require("../../../src/validators/placeValidators");

describe("validators/placeValidators", () => {
  describe("createPlaceSchema", () => {
    const validPayload = {
      slug: "praca-do-lago",
      image: "https://exemplo.com/praca.jpg",
      alt: "Praça do Lago",
      tag: "Lazer",
      location: "Centro",
      title: "Praça do Lago",
      description: "Estrutura de lazer no centro da cidade.",
    };

    it("aceita payload válido", () => {
      const { error } = createPlaceSchema.body.validate(validPayload);
      expect(error).toBeUndefined();
    });

    it("rejeita slug ausente", () => {
      const { slug, ...rest } = validPayload;
      const { error } = createPlaceSchema.body.validate(rest);
      expect(error).toBeDefined();
    });

    it("rejeita image que não é URL", () => {
      const { error } = createPlaceSchema.body.validate({
        ...validPayload,
        image: "nao-e-url",
      });
      expect(error).toBeDefined();
    });

    it("rejeita tag fora do enum", () => {
      const { error } = createPlaceSchema.body.validate({
        ...validPayload,
        tag: "Inexistente",
      });
      expect(error).toBeDefined();
    });

    it("rejeita title ausente", () => {
      const { title, ...rest } = validPayload;
      const { error } = createPlaceSchema.body.validate(rest);
      expect(error).toBeDefined();
    });

    it("rejeita description ausente", () => {
      const { description, ...rest } = validPayload;
      const { error } = createPlaceSchema.body.validate(rest);
      expect(error).toBeDefined();
    });

    it("rejeita campos desconhecidos (unknown: false)", () => {
      const { error } = createPlaceSchema.body.validate({
        ...validPayload,
        owner: "x",
      });
      expect(error).toBeDefined();
    });
  });

  describe("placeIdSchema", () => {
    it("aceita ObjectId válido (24 hex)", () => {
      const { error } = placeIdSchema.params.validate({
        placeId: "6b05aada377365f4413f9326",
      });
      expect(error).toBeUndefined();
    });

    it("rejeita placeId com caracteres não-hex", () => {
      const { error } = placeIdSchema.params.validate({
        placeId: "zzzzzzzzzzzzzzzzzzzzzzzz",
      });
      expect(error).toBeDefined();
    });

    it("rejeita placeId com tamanho errado", () => {
      const { error } = placeIdSchema.params.validate({ placeId: "abc123" });
      expect(error).toBeDefined();
    });
  });
});
