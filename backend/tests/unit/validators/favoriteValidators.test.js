"use strict";

const {
  favoriteParamsSchema,
} = require("../../../src/validators/favoriteValidators");

describe("validators/favoriteValidators", () => {
  describe("favoriteParamsSchema", () => {
    it("aceita placeId válido (24 hex)", () => {
      const { error } = favoriteParamsSchema.params.validate({
        placeId: "6b05aada377365f4413f9326",
      });
      expect(error).toBeUndefined();
    });

    it("rejeita placeId com caracteres não-hex", () => {
      const { error } = favoriteParamsSchema.params.validate({
        placeId: "id-invalido",
      });
      expect(error).toBeDefined();
    });

    it("rejeita placeId curto (menos de 24 caracteres)", () => {
      const { error } = favoriteParamsSchema.params.validate({
        placeId: "abc",
      });
      expect(error).toBeDefined();
    });

    it("rejeita placeId longo (mais de 24 caracteres)", () => {
      const { error } = favoriteParamsSchema.params.validate({
        placeId: "a".repeat(25),
      });
      expect(error).toBeDefined();
    });
  });
});
