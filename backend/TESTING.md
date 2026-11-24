# Validação manual da API - Fase D

Registro dos testes executados com `curl` para validar os 10 endpoints antes de partir para os testes automatizados (Jest, Fase F).

## Pré-requisitos

- MongoDB local em `mongodb://127.0.0.1:27017`
- `npm run dev` rodando em `http://localhost:3000`
- Usuário `admin@juruena.com` promovido a `role: 'admin'` via Compass
- Usuário `user@juruena.com` (role padrão `'user'`)
- Place criado com `slug: 'praca-do-lago'`

## Auth

| #   | Endpoint                                   | Esperado   | Obtido |
| --- | ------------------------------------------ | ---------- | ------ |
| 1   | `POST /api/signup` com body válido         | 201 + user | ✅     |
| 2   | `POST /api/signup` com email duplicado     | 409        | ✅     |
| 3   | `POST /api/signin` com credenciais válidas | 200 + JWT  | ✅     |
| 4   | `POST /api/signin` com senha errada        | 401        | ✅     |
| 5   | `GET /api/users/me` com token              | 200 + user | ✅     |
| 6   | `GET /api/users/me` sem token              | 401        | ✅     |

## Places (admin)

| #   | Endpoint                                   | Esperado         | Obtido |
| --- | ------------------------------------------ | ---------------- | ------ |
| 7   | `POST /api/places` sem token               | 401              | ✅     |
| 8   | `POST /api/places` com token de user comum | 403 (checkAdmin) | ✅     |
| 9   | `POST /api/places` com token de admin      | 201              | ✅     |
| 10  | `POST /api/places` com slug duplicado      | 409              | ✅     |
| 11  | `GET /api/places` (público)                | 200 + array      | ✅     |
| 12  | `POST /api/places` com tag inválida        | 400 (celebrate)  | ✅     |

## Favorites (user)

| #   | Endpoint                                     | Esperado             | Obtido |
| --- | -------------------------------------------- | -------------------- | ------ |
| 13  | `GET /api/favorites` sem token               | 401                  | ✅     |
| 14  | `GET /api/favorites` com lista vazia         | 200 `[]`             | ✅     |
| 15  | `POST /api/favorites/:placeId` válido        | 201 + place populado | ✅     |
| 16  | `POST /api/favorites/:placeId` duplicado     | 409                  | ✅     |
| 17  | `GET /api/favorites` com 1 item              | 200 + place populado | ✅     |
| 18  | `POST /api/favorites/:id-inexistente`        | 404 (evita órfão)    | ✅     |
| 19  | `POST /api/favorites/:id-invalido`           | 400 (celebrate)      | ✅     |
| 20  | `DELETE /api/favorites/:placeId` próprio     | 200                  | ✅     |
| 21  | `GET /api/favorites` após delete             | 200 `[]`             | ✅     |
| 22  | `DELETE /api/favorites/:placeId` inexistente | 404                  | ✅     |

## Error handling (Fase C, revalidado)

| #   | Cenário                           | Esperado                  | Obtido |
| --- | --------------------------------- | ------------------------- | ------ |
| 23  | `POST /api/signup` com body vazio | 400 (celebrate)           | ✅     |
| 24  | JSON malformado                   | 400 (SyntaxError tratado) | ✅     |
| 25  | Rota inexistente                  | 404 (notFound)            | ✅     |
| 26  | `GET /api/health`                 | 200                       | ✅     |

## Resultado

**26/26 testes manuais passaram.** A API está funcional e as autorizações em 2 camadas (auth + checkAdmin) estão comprovadas.
