"use strict";

const {
  signupSchema,
  signinSchema,
} = require("../../../src/validators/authValidators");

describe("validators/authValidators", () => {
  describe("signupSchema", () => {
    const validPayload = {
      name: "Michael Ribeiro",
      email: "michael@example.com",
      password: "senhaForte123",
    };

    it("aceita payload válido", () => {
      const { error } = signupSchema.body.validate(validPayload);
      expect(error).toBeUndefined();
    });

    it("rejeita body vazio", () => {
      const { error } = signupSchema.body.validate({});
      expect(error).toBeDefined();
    });

    it("rejeita name com menos de 2 caracteres", () => {
      const { error } = signupSchema.body.validate({
        ...validPayload,
        name: "M",
      });
      expect(error).toBeDefined();
    });

    it("rejeita name com mais de 30 caracteres", () => {
      const { error } = signupSchema.body.validate({
        ...validPayload,
        name: "a".repeat(31),
      });
      expect(error).toBeDefined();
    });

    it("rejeita email inválido", () => {
      const { error } = signupSchema.body.validate({
        ...validPayload,
        email: "nao-e-email",
      });
      expect(error).toBeDefined();
    });

    it("rejeita password com menos de 8 caracteres", () => {
      const { error } = signupSchema.body.validate({
        ...validPayload,
        password: "1234567",
      });
      expect(error).toBeDefined();
    });

    it("rejeita campos desconhecidos (unknown: false)", () => {
      const { error } = signupSchema.body.validate({
        ...validPayload,
        role: "admin",
      });
      expect(error).toBeDefined();
    });
  });

  describe("signinSchema", () => {
    const validPayload = {
      email: "michael@example.com",
      password: "senhaForte123",
    };

    it("aceita payload válido", () => {
      const { error } = signinSchema.body.validate(validPayload);
      expect(error).toBeUndefined();
    });

    it("rejeita body vazio", () => {
      const { error } = signinSchema.body.validate({});
      expect(error).toBeDefined();
    });

    it("rejeita email inválido", () => {
      const { error } = signinSchema.body.validate({
        ...validPayload,
        email: "invalido",
      });
      expect(error).toBeDefined();
    });

    it("rejeita password ausente", () => {
      const { error } = signinSchema.body.validate({
        email: validPayload.email,
      });
      expect(error).toBeDefined();
    });
  });
});
