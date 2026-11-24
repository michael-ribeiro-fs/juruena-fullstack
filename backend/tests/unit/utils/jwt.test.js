"use strict";

const jwt = require("jsonwebtoken");

const { signToken, verifyToken } = require("../../../src/utils/jwt");
const { JWT_SECRET } = require("../../../src/config/env");

describe("utils/jwt", () => {
  describe("signToken", () => {
    it("retorna um JWT com 3 partes separadas por ponto", () => {
      const token = signToken({ _id: "abc123" });
      expect(token.split(".")).toHaveLength(3);
    });

    it("inclui o payload no token decodificado", () => {
      const token = signToken({ _id: "abc123" });
      const decoded = jwt.decode(token);
      expect(decoded._id).toBe("abc123");
    });
  });

  describe("verifyToken", () => {
    it("retorna o payload para token válido", () => {
      const token = signToken({ _id: "abc123" });
      const decoded = verifyToken(token);
      expect(decoded._id).toBe("abc123");
    });

    it("lança erro para token malformado", () => {
      expect(() => verifyToken("token.invalido.aqui")).toThrow();
    });

    it("lança erro para token expirado", () => {
      const expiredToken = jwt.sign({ _id: "abc" }, JWT_SECRET, {
        expiresIn: "-1s",
      });
      expect(() => verifyToken(expiredToken)).toThrow(/expired/i);
    });

    it("lança erro para token assinado com outra secret", () => {
      const fakeToken = jwt.sign({ _id: "abc" }, "outra-secret-qualquer", {
        expiresIn: "1h",
      });
      expect(() => verifyToken(fakeToken)).toThrow();
    });
  });
});
