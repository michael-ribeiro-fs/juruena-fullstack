# Juruena · Backend

API REST do projeto **Juruena — Guia Regional e Cultural**, construída com Node.js, Express e MongoDB. Gerencia autenticação de usuários, catálogo de lugares e favoritos, com autorização em duas camadas (`auth` + `checkAdmin`).

> **Escopo:** esta documentação cobre apenas o backend. Deploy, integração com o frontend e MongoDB Atlas são tratados na Fase 3.

---

## Stack

| Camada         | Tecnologia                            |
| -------------- | ------------------------------------- |
| Runtime        | Node.js 20+                           |
| Framework HTTP | Express 4                             |
| Banco          | MongoDB (local em dev/test)           |
| ODM            | Mongoose 7                            |
| Autenticação   | JWT (jsonwebtoken) + bcryptjs         |
| Validação      | Joi + Celebrate                       |
| Logging        | Winston + express-winston             |
| Segurança      | Helmet + CORS + express-rate-limit    |
| Testes         | Jest + Supertest                      |
| Lint           | ESLint (Airbnb base)                  |
| Módulos        | CommonJS (`require`/`module.exports`) |

---

## Mapa de Pastas

Cada pasta tem uma responsabilidade única. Abaixo, o que fica em cada uma e exemplos reais de arquivos.

### `src/`

Ponto de entrada da aplicação. Contém apenas dois arquivos na raiz:

- `app.js` — instância do Express com middlewares e rotas montadas (sem `listen`)
- `server.js` — ponto de entrada real: valida env, conecta ao MongoDB e chama `app.listen(3000)`

Separar os dois permite testar a API via Supertest sem subir porta.

### `src/config/`

Configuração transversal. Lê variáveis de ambiente, expõe constantes e conecta ao banco.

- `env.js` — carrega `.env`, valida em produção (`JWT_SECRET`, `MONGO_URI` obrigatórios) e exporta PORT, MONGO_URI, JWT_SECRET, etc.
- `constants.js` — `HTTP_STATUS`, `ERROR_MESSAGES`, `PLACE_TAGS` (enum de categorias)
- `database.js` — `connectDatabase()` e `disconnectDatabase()` via Mongoose
- `index.js` — barrel que agrega os três acima

### `src/models/`

Schemas Mongoose. Cada arquivo exporta um `mongoose.model()`.

- `user.js` — campos `name`, `email`, `password` (com `select: false`), `role` (enum `user`/`admin`), hook `pre('save')` que hasheia a senha, método `comparePassword`
- `place.js` — catálogo global: `slug` (único), `image`, `alt`, `tag` (enum), `location`, `title`, `description`
- `favorite.js` — junção N:N `user` ↔ `place` com índice composto `{ user, place }` único
- `index.js` — barrel que exporta `{ User, Place, Favorite }`

### `src/controllers/`

Lógica de negócio. Cada função recebe `(req, res)`, orquestra o model e responde. Erros são lançados como classes tipadas (o `errorHandler` captura).

- `authController.js` — `signup` (cria user, delega hash ao hook do model) e `signin` (valida senha, emite JWT)
- `userController.js` — `getMe` retorna `{ _id, name, email, role }` do `req.user`
- `placeController.js` — `listPlaces` (público), `createPlace` (admin), `deletePlace` (admin, remove favoritos órfãos)
- `favoriteController.js` — `listFavorites` (popula place), `addFavorite` (verifica existência do place), `removeFavorite` (defesa de dono)
- `index.js` — barrel

### `src/routes/`

Mapeamento URL → middlewares → controller. Cada arquivo usa `express.Router()`.

- `authRoutes.js` — `POST /signup` e `POST /signin` com `authLimiter` + `validate`
- `userRoutes.js` — `GET /me` com `auth`
- `placeRoutes.js` — `GET /` (público), `POST /` (auth+checkAdmin+validate), `DELETE /:placeId` (auth+checkAdmin+validate)
- `favoriteRoutes.js` — `router.use(auth)` no topo; `GET /`, `POST /:placeId`, `DELETE /:placeId`
- `index.js` — monta tudo sob `/api`

### `src/middlewares/`

Cross-cutting concerns. Middlewares Express `(req, res, next)`.

- `auth.js` — extrai Bearer token, valida JWT, busca User e injeta `req.user`
- `checkAdmin.js` — 403 se `req.user.role !== 'admin'` (assume `auth` antes)
- `asyncHandler.js` — wrappa controllers async e delega erros ao `next` (retorna a Promise)
- `errorHandler.js` — normaliza AppError, CelebrateError, ValidationError, CastError, SyntaxError, E11000, fallback 500
- `notFound.js` — 404 explícito para rotas não mapeadas
- `validate.js` — wrapper do Celebrate com `abortEarly: false`
- `requestLogger.js` — Winston grava `request.log` (skip em `NODE_ENV=test`)
- `security.js` — `applySecurity(app)` monta Helmet + CORS + rate-limit global; exporta `authLimiter` (10 req/15min)
- `index.js` — barrel

### `src/validators/`

Schemas Joi declarativos. Usados pelo middleware `validate` antes do controller.

- `authValidators.js` — `signupSchema` (name 2–30, email, password ≥8), `signinSchema`
- `placeValidators.js` — `createPlaceSchema` (todos os campos obrigatórios, tag no enum), `placeIdSchema` (hex 24 chars)
- `favoriteValidators.js` — `favoriteParamsSchema` (placeId hex 24)
- `index.js` — barrel

### `src/errors/`

Classes de erro tipadas. Cada uma carrega `statusCode` e `isOperational: true`, permitindo que o `errorHandler` responda corretamente sem `if` espalhados.

- `AppError.js` — classe base
- `BadRequestError.js` — 400
- `UnauthorizedError.js` — 401
- `ForbiddenError.js` — 403
- `NotFoundError.js` — 404
- `ConflictError.js` — 409
- `index.js` — barrel

### `src/utils/`

Funções puras, sem estado, sem dependência de `req`/`res`. Testáveis isoladamente.

- `hash.js` — `hashPassword`, `comparePassword` (bcryptjs)
- `jwt.js` — `signToken`, `verifyToken`
- `index.js` — barrel

### `src/logger/`

- `logger.js` — Winston configurado para gravar `error.log` (level `error`) + console em dev. Silencioso em `test`/`production`
- `index.js` — barrel

### `tests/`

Infraestrutura e testes automatizados. Estrutura espelha `src/`.

- `setupFilesAfterEnv.js` — `beforeAll` conecta ao `MONGO_URI_TEST`, `beforeEach` limpa collections, `afterAll` desconecta
- `unit/` — testes sem I/O (utils, validators, errors, middlewares sem DB)
- `integration/` — testes HTTP completos via Supertest + Mongo real (auth, places, favorites, health)

---

## Fluxo de uma Requisição

Exemplo: `POST /api/places` com Bearer token de admin.

```
1. Cliente envia HTTP POST + Authorization: Bearer <jwt> + JSON body
       ↓
2. Helmet + CORS + rate-limit global (security.js)
       ↓
3. express.json() parseia o body
       ↓
4. requestLogger grava em request.log (skip em test)
       ↓
5. Router /api → /places → placeRoutes.js
       ↓
6. auth.js valida JWT, busca User no DB, injeta req.user
       ↓
7. checkAdmin.js verifica role === 'admin' → 403 se não
       ↓
8. validate(createPlaceSchema) → 400 se body inválido
       ↓
9. placeController.createPlace:
   - verifica slug duplicado → 409 se existe
   - Place.create(body) → 201 com o doc salvo
       ↓
10. Se qualquer camada lançar erro → next(err) → errorHandler
    normaliza para { message } + statusCode apropriado
```

**Ordem dos middlewares em `app.js`** é crítica:

```
applySecurity → express.json → requestLogger → routes → notFound → errorHandler
```

---

## Endpoints da API

Prefixo global: `/api`. Formato de erro: `{ "message": "string" }`.

| Método   | Rota                      | Auth | Role      | Códigos                 |
| -------- | ------------------------- | ---- | --------- | ----------------------- |
| `GET`    | `/api/health`             | —    | —         | 200                     |
| `POST`   | `/api/signup`             | —    | —         | 201, 400, 409           |
| `POST`   | `/api/signin`             | —    | —         | 200, 400, 401           |
| `GET`    | `/api/users/me`           | ✅   | user      | 200, 401                |
| `GET`    | `/api/places`             | —    | —         | 200                     |
| `POST`   | `/api/places`             | ✅   | **admin** | 201, 400, 401, 403, 409 |
| `DELETE` | `/api/places/:placeId`    | ✅   | **admin** | 200, 400, 401, 403, 404 |
| `GET`    | `/api/favorites`          | ✅   | user      | 200, 401                |
| `POST`   | `/api/favorites/:placeId` | ✅   | user      | 201, 400, 401, 404, 409 |
| `DELETE` | `/api/favorites/:placeId` | ✅   | user      | 200, 400, 401, 403, 404 |

**Autorização em 2 camadas:**

- `auth` — qualquer usuário autenticado
- `auth` + `checkAdmin` — apenas `role === 'admin'`

**Promoção a admin** é feita manualmente no MongoDB:

```js
db.users.updateOne({ email: "admin@juruena.com" }, { $set: { role: "admin" } });
```

---

## Modelos de Dados

### User

```js
{
  _id:       ObjectId,
  name:      String,    // 2–30 chars, required
  email:     String,    // unique, lowercase, required
  password:  String,    // hash bcrypt, select: false
  role:      String,    // enum ['user','admin'], default 'user'
  createdAt: Date,
  updatedAt: Date,
}
```

### Place

```js
{
  _id:         ObjectId,
  slug:        String,  // unique global, kebab-case
  image:       String,  // URL
  alt:         String,
  tag:         String,  // enum: Natureza|Lazer|Gastronomia|Cultura|Turismo rural|Outros
  location:    String,
  title:       String,  // 2–100 chars
  description: String,  // 10–500 chars
  createdAt:   Date,
  updatedAt:   Date,
}
```

### Favorite

```js
{
  _id:       ObjectId,
  user:      ObjectId → ref 'user',   // required
  place:     ObjectId → ref 'place',  // required
  createdAt: Date,
}
```

Índice composto `{ user: 1, place: 1 }` único impede favoritar o mesmo lugar 2x.

---

## Como Criar uma Nova Rota

Cenário exemplo: adicionar `POST /api/places/:placeId/reviews` (avaliação de um lugar).

### 1. Model (se necessário)

Criar `src/models/review.js`:

```js
"use strict";
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "place",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("review", reviewSchema);
```

Adicionar no `src/models/index.js`: `Review: require('./review')`.

### 2. Validator

Criar `src/validators/reviewValidators.js`:

```js
"use strict";
const { Joi } = require("celebrate");

const createReviewSchema = {
  params: Joi.object({ placeId: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).allow(""),
  }).unknown(false),
};

module.exports = { createReviewSchema };
```

Adicionar no `src/validators/index.js`:

```js
...require('./reviewValidators'),
```

### 3. Controller

Criar `src/controllers/reviewController.js`:

```js
"use strict";
const { Review, Place } = require("../models");
const { NotFoundError } = require("../errors");

async function createReview(req, res) {
  const place = await Place.findById(req.params.placeId);
  if (!place) throw new NotFoundError("Lugar não encontrado");

  const review = await Review.create({
    user: req.user._id,
    place: place._id,
    ...req.body,
  });

  res.status(201).json(review);
}

module.exports = { createReview };
```

Adicionar no `src/controllers/index.js`:

```js
reviewController: require('./reviewController'),
```

### 4. Rota

Criar `src/routes/reviewRoutes.js` (ou adicionar em `placeRoutes.js` se for aninhada):

```js
"use strict";
const express = require("express");
const { reviewController } = require("../controllers");
const { auth, asyncHandler, validate } = require("../middlewares");
const { createReviewSchema } = require("../validators/reviewValidators");

const router = express.Router();

router.post(
  "/:placeId/reviews",
  auth,
  validate(createReviewSchema),
  asyncHandler(reviewController.createReview),
);

module.exports = router;
```

### 5. Montar no router raiz

Editar `src/routes/index.js`:

```js
const reviewRoutes = require("./reviewRoutes");
router.use("/places", reviewRoutes);
```

### 6. Teste

Criar `tests/integration/reviews.test.js`:

```js
"use strict";
const request = require("supertest");
const app = require("../../src/app");
const { Place } = require("../../src/models");

describe("POST /api/places/:placeId/reviews", () => {
  it("cria review autenticado", async () => {
    const place = await Place.create({
      /* ... */
    });
    // signup + signin, pegar token
    const res = await request(app)
      .post(`/api/places/${place._id}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, comment: "Ótimo lugar" });

    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(5);
  });
});
```

### 7. Validar e commitar

```bash
npm test       # todos os testes verdes, incluindo os novos
npm run lint   # zero erros
git add .
git commit -m "feat(backend): adiciona endpoint de avaliações de lugares"
```

---

## Como Criar um Novo Teste

### Teste unitário (sem banco)

Para funções puras, validators, classes de erro e middlewares que não tocam o DB.

`tests/unit/utils/nomeDoModulo.test.js`:

```js
"use strict";

const { funcao } = require("../../../src/utils/nomeDoModulo");

describe("utils/nomeDoModulo", () => {
  it("descrição do comportamento esperado", () => {
    const resultado = funcao(entrada);
    expect(resultado).toBe(valorEsperado);
  });
});
```

**Boas práticas:**

- Nome do `describe` = caminho do módulo (`utils/hash`, `middlewares/auth`)
- Nome do `it` = comportamento, não implementação (`retorna X quando Y`)
- Um `expect` por conceito (pode ter múltiplos se testam a mesma coisa)

### Teste de integração (com banco real)

Para testar o fluxo HTTP completo (`request → middleware → controller → model → DB → response`).

`tests/integration/nomeDoRecurso.test.js`:

```js
"use strict";

const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/recurso", () => {
  it("retorna 201 com payload válido", async () => {
    const res = await request(app)
      .post("/api/recurso")
      .send({ campo: "valor" });
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
  });
});
```

**Nota:** o `beforeEach` de `tests/setupFilesAfterEnv.js` limpa as collections automaticamente — cada `it` começa com o banco vazio. Não é preciso limpar manualmente.

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- MongoDB Server rodando em `localhost:27017`
- MongoDB Compass (opcional, para inspecionar o banco)

### Setup inicial

```bash
# 1. Clonar e entrar na pasta
git clone <repo>
cd juruena-fullstack/backend

# 2. Instalar dependências
npm install

# 3. Criar .env a partir do template
cp .env.example .env

# 4. Confirmar que o MongoDB está rodando
ps aux | grep mongod | grep -v grep

# 5. Iniciar em modo dev (hot reload)
npm run dev
```

**Saída esperada:**

```
info: Servidor rodando em http://localhost:3000
info: Conectado ao MongoDB
```

### Primeiros passos após subir

```bash
# Verificar health
curl http://localhost:3000/api/health

# Criar usuário
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@juruena.com","password":"admin12345"}'

# Login
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@juruena.com","password":"admin12345"}'
```

---

## Scripts npm

| Script                  | O que faz                                          |
| ----------------------- | -------------------------------------------------- |
| `npm start`             | Inicia servidor em produção (`node src/server.js`) |
| `npm run dev`           | Inicia com hot reload (`nodemon`)                  |
| `npm test`              | Roda todos os testes Jest                          |
| `npm run test:watch`    | Roda testes em modo watch                          |
| `npm run test:coverage` | Roda testes com relatório de cobertura             |
| `npm run lint`          | Verifica o código com ESLint                       |

**Como os testes rodam:** o `jest.config.js` aponta `testMatch` para `tests/**/*.test.js`. O `setupFilesAfterEnv.js` conecta ao `MONGO_URI_TEST` antes de tudo, limpa as collections antes de cada `it`, e desconecta no final. `maxWorkers: 1` evita race condition quando múltiplos arquivos compartilham o mesmo banco.

**Cobertura:** `collectCoverageFrom` exclui arquivos de infraestrutura (barrels `index.js`, `config/env.js`, `config/database.js`, `logger.js`, `security.js`, `requestLogger.js`) — código de configuração/startup que não tem lógica de negócio testável isoladamente. Threshold global: **80% em lines/branches/functions/statements**.

---

## Catálogo de Testes

**Total: 111 testes, 16 suítes, cobertura 97.99% statements / 90.76% branches.**

### Unitários (63)

| Arquivo                                      | Cobre                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `unit/utils/hash.test.js`                    | `hashPassword`, `comparePassword`                                                               |
| `unit/utils/jwt.test.js`                     | `signToken`, `verifyToken` (válido, malformado, expirado, secret errada)                        |
| `unit/validators/authValidators.test.js`     | schemas signup/signin (válido, campos vazios, tamanhos, unknown)                                |
| `unit/validators/placeValidators.test.js`    | create (campos obrigatórios, tag enum, URL) e placeId (hex 24)                                  |
| `unit/validators/favoriteValidators.test.js` | placeId (hex 24, tamanhos)                                                                      |
| `unit/errors/AppError.test.js`               | base + 5 filhas com statusCode e `instanceof`                                                   |
| `unit/middlewares/asyncHandler.test.js`      | resolve, reject, não chama `next` em sucesso                                                    |
| `unit/middlewares/errorHandler.test.js`      | todos os tipos de erro (AppError, Celebrate, SyntaxError, 413, E11000, CastError, fallback 500) |
| `unit/middlewares/auth.test.js`              | sem header, sem Bearer, token inválido, user sumiu, sucesso                                     |
| `unit/middlewares/checkAdmin.test.js`        | admin, user comum, sem `req.user`                                                               |
| `unit/middlewares/notFound.test.js`          | 404 com mensagem correta                                                                        |
| `unit/models/user.test.js`                   | hook `pre('save')`: re-hash apenas quando password muda                                         |

### Integração (48)

| Arquivo                         | Cobre                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `integration/health.test.js`    | `GET /api/health` retorna 200 + shape                                                                  |
| `integration/auth.test.js`      | signup 201/400/409 + hash no DB, signin 200/400/401, me 200/401                                        |
| `integration/places.test.js`    | GET público, POST admin 201/400/401/403/409, DELETE admin 200/400/401/403/404, integridade referencial |
| `integration/favorites.test.js` | GET 200/401 + populate, POST 201/400/401/404/409 + multi-user, DELETE 200/400/401/404 + defesa de dono |

---

## Decisões Arquiteturais

| Decisão                                        | Justificativa                                                                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **CommonJS** (`require`/`module.exports`)      | Padrão do curso TripleTen; Jest roda nativamente sem Babel                                                              |
| **`app.js` separado de `server.js`**           | Permite Supertest importar `app` sem `listen` (sem porta ocupada nos testes)                                            |
| **Sem `services/` nem `repositories/`**        | Para 3 models e 10 endpoints, camadas extras são indireção sem ganho. Controller + Model direto é suficiente e testável |
| **Erros tipados (`AppError` + 5 filhas)**      | `errorHandler` responde corretamente sem `if` espalhados pelo código                                                    |
| **`asyncHandler` retorna a Promise**           | Necessário para testes com I/O real; em prod, Express ignora o retorno                                                  |
| **Celebrate v15 + Joi v17**                    | Versão do curso; Celebrate 16+ muda estrutura do erro                                                                   |
| **Mongoose 7**                                 | Mongoose 8 tem bug de compatibilidade com o driver em Jest (`Missing driver`)                                           |
| **`maxWorkers: 1` no Jest**                    | Evita race condition quando múltiplos arquivos compartilham o mesmo DB                                                  |
| **Rate-limit desabilitado em `NODE_ENV=test`** | Senão os 111 testes estouram o limite de 10 req/15min                                                                   |
| **`requestLogger` skip em test**               | Não polui `request.log` com requests de teste                                                                           |
| **`meta: false` no requestLogger**             | Não loga `req.body` (evita vazar senhas no `request.log`)                                                               |
| **Barrels `index.js` excluídos da cobertura**  | Re-exportam apenas, sem lógica testável                                                                                 |

---

## Segurança

| Camada              | Implementação                                                                      |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Transporte**      | HTTPS no deploy (fase 3); Helmet com CSP, HSTS, X-Frame-Options                    |
| **CORS**            | Restrito a `CORS_ORIGINS` (localhost:5173/3000 em dev)                             |
| **Senha**           | bcryptjs com `saltRounds: 10`; hash nunca retornado (`select: false`)              |
| **JWT**             | HS256, expiração 7d; `JWT_SECRET` via env (fallback `'dev-secret'` só em dev/test) |
| **Autorização**     | 2 camadas: `auth` (autenticado) + `checkAdmin` (role admin)                        |
| **Dono de recurso** | `removeFavorite` verifica `user` na query (não pode deletar favorito alheio)       |
| **Validação**       | Joi estrito (sem `allowUnknown`) antes do controller                               |
| **Rate-limit**      | Global 100/15min, auth 10/15min (proteção brute-force)                             |
| **Logs**            | Winston grava `error.log` + `request.log` fora do Git                              |
| **Não-vazamento**   | Stack trace nunca vai ao cliente em prod; senha/token nunca logados                |

---

## Variáveis de Ambiente

Todas em `.env` (fora do Git) com fallback no `.env.example` (versionado).

| Variável         | Dev                                           | Prod               | Obrigatória           |
| ---------------- | --------------------------------------------- | ------------------ | --------------------- |
| `PORT`           | 3000                                          | definido pelo host | não                   |
| `NODE_ENV`       | development                                   | production         | não                   |
| `MONGO_URI`      | `mongodb://127.0.0.1:27017/juruena-dev`       | Atlas URI          | **sim em prod**       |
| `MONGO_URI_TEST` | `mongodb://127.0.0.1:27017/juruena-test`      | —                  | sim (para `npm test`) |
| `JWT_SECRET`     | `dev-secret`                                  | string 256-bit     | **sim em prod**       |
| `JWT_EXPIRES_IN` | 7d                                            | 7d                 | não                   |
| `CORS_ORIGINS`   | `http://localhost:5173,http://localhost:3000` | domínio do front   | não                   |
| `LOG_DIR`        | `./logs`                                      | `./logs`           | não                   |

`config/env.js` valida em `NODE_ENV=production` e lança erro se `JWT_SECRET` ou `MONGO_URI` faltarem — o processo não sobe.

---

## Validação Manual

O arquivo `TESTING.md` registra os **26 testes manuais via curl** que validaram o fluxo completo antes dos testes automatizados. Serve como referência rápida para QA manual em caso de mudança de comportamento.
