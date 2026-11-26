# Juruena - Guia Regional e Cultural

Guia digital de lugares, cultura e sabores de Juruena, Mato Grosso. Projeto full-stack final do bootcamp de Desenvolvimento Full-Stack da TripleTen (Sprint 19).

**Deploy:** https://juruena-fullstack.vercel.app/

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-5-CA4245?logo=reactrouter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-HS256-black?logo=jsonwebtokens&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-32_tests-6E9F18?logo=vitest&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-111_tests-C21325?logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-Airbnb-4B32C3?logo=eslint&logoColor=white)

---

## Problema

Juruena é um município do noroeste de Mato Grosso, marcado por sua relação com a natureza e pela diversidade da região amazônica. Apesar de ser um destino rico em ecossistemas, cultura ribeirinha e tradições sustentáveis (como a colheita da castanha-do-brasil), **não existe uma plataforma digital centralizada** que reúna informações sobre lugares, história e dados práticos da cidade.

Turistas e moradores enfrentam:

- Falta de informação consolidada sobre pontos turísticos
- Ausência de dados climáticos em tempo real
- Nenhum canal digital para colaboração comunitária (sugestão de lugares)
- Nenhum mecanismo para salvar lugares de interesse e revisitá-los

---

## Solução

O **Juruena - Guia Regional e Cultural** é uma aplicação full-stack que une **React (frontend)** e **Node.js + Express + MongoDB (backend)** para oferecer:

- **Landing page** com hero, seção sobre a cidade, clima em tempo real e prévia do catálogo
- **Catálogo completo de lugares** (`/lugares`) com busca textual, filtros por categoria e empty state
- **Favoritos** (`/favoritos`) com persistência real por usuário autenticado
- **Clima em tempo real** via [Open-Meteo API](https://open-meteo.com/) (pública, sem autenticação)
- **Modal de detalhes** (lightbox) ao clicar em um lugar
- **Autenticação real** com JWT (cadastro, login, logout e sessão persistida)
- **Painel administrativo** (`/admin`) protegido por role, com cadastro e exclusão de lugares
- **Banner de cookies** em conformidade com a LGPD, com consentimento persistido em `localStorage`
- **Design responsivo mobile-first**, com design system baseado em tokens CSS
- **Testes automatizados:** 32 no frontend (Vitest) e 111 no backend (Jest + SuperTest)

### Screenshots

**Home**

![Home](./frontend/public/home.png)

**Modal de detalhes do lugar**

![Detalhes do lugar](./frontend/public/big-image.png)

**Popup de autenticação (desktop)**

![Popup de autenticação](./frontend/public/popup-form.png)

**Popup de autenticação (mobile)**

![Popup mobile](./frontend/public/mobile-form.png)

---

## Arquitetura

Monorepo com duas aplicações independentes, `frontend/` e `backend/`. Cada uma possui seu próprio `package.json`, testes, lint e deploy.

```text
juruena-fullstack/
├── frontend/           # React + Vite
├── backend/            # Node.js + Express + MongoDB
├── README.md
└── .gitignore
```

### Frontend

Estrutura organizada por responsabilidade, sem misturar camadas:

```text
frontend/
├── public/                  # Assets estáticos (favicon, screenshots)
├── src/
│   ├── assets/images/       # Imagens importadas via Vite
│   ├── components/          # Componentes reutilizáveis
│   │   ├── About/           # Seção "Sobre a Cidade"
│   │   ├── AuthPopup/       # Popup de login/cadastro
│   │   ├── CookieBanner/    # Banner LGPD
│   │   ├── CTA/             # Call-to-action
│   │   ├── Footer/          # Rodapé
│   │   ├── Header/          # Cabeçalho com variant + hamburguer mobile
│   │   ├── Hero/            # Hero da home
│   │   ├── PlaceCard/       # Card de lugar (favoritar + modal)
│   │   ├── PlaceModal/      # Modal lightbox
│   │   ├── PlaceForm/       # Formulário de cadastro (admin)
│   │   ├── Places/          # Seção de lugares da home
│   │   ├── ProtectedRoute/  # HOC de rota protegida (+ role)
│   │   └── Weather/         # Clima (recebe dados via props)
│   ├── contexts/            # CurrentUserContext
│   ├── pages/               # Páginas roteadas
│   │   ├── MainPage/        # Home
│   │   ├── PlacesPage/      # Catálogo
│   │   ├── FavoritesPage/   # Favoritos (protegida)
│   │   ├── AdminPage/       # Painel admin (role admin)
│   │   └── NotFoundPage/    # 404
│   ├── services/            # Integrações com API
│   │   ├── authApi.js       # signup, signin, getCurrentUser
│   │   ├── placesApi.js     # get, create, delete
│   │   ├── favoritesApi.js  # get, add, remove
│   │   ├── weatherApi.js    # Open-Meteo
│   │   └── handleResponse.js
│   ├── styles/              # Design system
│   │   ├── tokens.css       # Variáveis (cores, fontes, espaçamentos)
│   │   ├── global.css       # Reset + base
│   │   └── layout.css       # Helpers (.container)
│   ├── utils/               # Funções puras testáveis
│   │   └── filterPlaces.js
│   ├── vendor/              # Recursos de terceiros
│   │   ├── fonts/           # Fraunces + Inter (woff2)
│   │   ├── fonts.css
│   │   └── normalize.css
│   ├── App.jsx              # Orquestrador (fetch, rotas, popup, banner)
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── .eslintrc.json
```

**Princípios aplicados:**

- **Três arquivos por componente:** `Componente.jsx`, `Componente.css` e `data.js`
- **Dados estáticos em `data.js`:** zero conteúdo hardcoded no JSX
- **Design system em `tokens.css`:** alterar `--color-primary` reflete em todo o projeto
- **`App` como orquestrador:** fetch, rotas e estado global ficam centralizados
- **Componentes presentational:** `Weather` recebe dados via props e não faz fetch

### Backend

API REST em Node.js + Express + MongoDB, seguindo o padrão TripleTen (CommonJS, controller enxuto, Model direto).

```text
backend/
├── src/
│   ├── app.js               # Express app (sem listen)
│   ├── server.js            # Conecta ao banco + listen
│   ├── config/              # env, constants, database
│   ├── models/              # User, Place, Favorite
│   ├── controllers/         # auth, user, place, favorite
│   ├── routes/              # authRoutes, userRoutes, placeRoutes, favoriteRoutes
│   ├── middlewares/         # auth, checkAdmin, validate, errorHandler, etc.
│   ├── validators/          # Schemas Joi
│   ├── errors/              # AppError + classes filhas
│   ├── utils/               # hash, jwt
│   └── logger/              # Winston
├── tests/
│   ├── unit/                # 63 testes
│   └── integration/         # 48 testes
├── scripts/                 # seedPlaces.js
├── DOC.md                   # Documentação técnica completa
├── dummies.md               # Explicação simplificada do backend
└── package.json
```

**Documentação do backend:**

- [`backend/DOC.md`](./backend/DOC.md): referência técnica completa (arquitetura, endpoints, schemas, testes e decisões)
- [`backend/dummies.md`](./backend/dummies.md): explicação acessível para qualquer pessoa (frontend, QA, novos membros do time), sem jargão

---

## Decisões Técnicas

| Decisão                                            | Justificativa                                                                                                   |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Monorepo com `frontend/` + `backend/`**          | Cada parte tem seu `package.json`, testes e deploy independentes; estrutura simples, sem workspaces             |
| **React 19 + Vite**                                | Stack exigida pelo curso; Vite oferece HMR rápido e build otimizado                                             |
| **React Router v5**                                | Requisito do checklist (`<Switch>`, `<Route>`, `<Redirect>`, `useHistory()`)                                    |
| **Design tokens CSS**                              | Paleta inteira alterável em um único arquivo (`tokens.css`), sem refactor                                       |
| **BEM + `className`**                              | Nomenclatura CSS consistente, sem conflitos                                                                     |
| **Mobile-first**                                   | Media queries com `min-width`; sem scroll horizontal a partir de 320px                                          |
| **Fontes self-hosted (woff2)**                     | Performance (sem request externo) e independência de provedor                                                   |
| **Vitest (frontend)**                              | Integração nativa com Vite; sintaxe compatível com Jest, sem Babel                                              |
| **Node.js 20 + Express 4 + MongoDB**               | Stack backend padrão do curso; deploy simples e gratuito (Render + Atlas)                                       |
| **CommonJS (`require`/`module.exports`)**          | Padrão TripleTen; Jest roda nativamente sem Babel                                                               |
| **Jest + SuperTest (backend)**                     | 111 testes (unit + integration) com 97% de cobertura                                                            |
| **Sem `services/` nem `repositories/` no backend** | Controller → Model direto é suficiente para o escopo (3 models, 10 endpoints), sem over-engineering             |
| **JWT com `role` (user/admin)**                    | Autorização em duas camadas: `auth` (autenticado) + `checkAdmin` (administrador)                                |
| **Validação em módulo separado (Joi + Celebrate)** | Roda antes do controller; erros padronizados                                                                    |
| **Erros tipados (`AppError` + 5 filhas)**          | `errorHandler` central responde sem `if` espalhados                                                             |
| **`select: false` em `password`**                  | Hash nunca retorna em respostas (defesa em profundidade)                                                        |
| **Rate limit + Helmet + CORS**                     | Hardening: proteção contra brute-force, headers seguros e origens explícitas                                    |
| **Banner de cookies (LGPD)**                       | Aceitar/Recusar persiste em `localStorage`, preparando a integração com analytics condicionada ao consentimento |
| **`ProtectedRoute` (HOC) com `requiredRole`**      | `/favoritos` exige login; `/admin` exige `role === 'admin'`                                                     |
| **`eslint-disable` proibido**                      | Conforme checklist; exceções apenas via `.eslintrc.json`                                                        |

---

## Como Executar

### Pré-requisitos

- Node.js 20+ (recomendado 20.18 LTS)
- npm 9+
- MongoDB Atlas (cluster M0 gratuito) ou MongoDB local

### 1. Clonar o repositório

```bash
git clone https://github.com/michael-ribeiro-fs/juruena-fullstack.git
cd juruena-fullstack
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/juruena-dev
MONGO_URI_TEST=mongodb://127.0.0.1:27017/juruena-test
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5173
LOG_DIR=./logs
```

> Para usar o Atlas em vez do MongoDB local, substitua as URIs pelas connection strings do seu cluster.

Popule o catálogo inicial (opcional, mas recomendado):

```bash
node scripts/seedPlaces.js
```

Suba o servidor:

```bash
npm run dev
# → http://localhost:3000
```

### 3. Frontend

Em **outro terminal**:

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

O frontend chama `/api/*`, que é redirecionado pelo **proxy do Vite** para `http://localhost:3000` (configurado em `vite.config.js`). Nenhuma variável de ambiente adicional é necessária em desenvolvimento.

### Testes

```bash
# Frontend (Vitest) - 32 testes
cd frontend
npm test
npm run test:watch

# Backend (Jest) - 111 testes
cd backend
npm test
npm run test:coverage
```

### Lint

```bash
cd frontend && npm run lint
cd backend && npm run lint
```

### Build de produção

```bash
# Frontend
cd frontend
npm run build      # gera dist/
npm run preview    # preview local

# Backend
cd backend
npm start          # node src/server.js
```

### Como se tornar administrador

O painel `/admin` exige `role === 'admin'`. A promoção é feita **manualmente no MongoDB**:

```js
db.users.updateOne({ email: "seu@email.com" }, { $set: { role: "admin" } });
```

Após alterar, **faça logout e login novamente** (o JWT antigo contém a role anterior).

### Deploy

| Camada         | Plataforma         | URL                                   |
| -------------- | ------------------ | ------------------------------------- |
| Frontend       | Vercel             | https://juruena-fullstack.vercel.app/ |
| Backend        | Render             | https://juruena-backend.onrender.com  |
| Banco de dados | MongoDB Atlas (M0) | `juruena-prod`                        |

**Variáveis de ambiente em produção**

| Serviço | Variável       | Valor                                             |
| ------- | -------------- | ------------------------------------------------- |
| Vercel  | `VITE_API_URL` | `https://juruena-backend.onrender.com/api`        |
| Render  | `NODE_ENV`     | `production`                                      |
| Render  | `MONGO_URI`    | Connection string do Atlas (`juruena-prod`)       |
| Render  | `JWT_SECRET`   | Chave de 256 bits gerada com `crypto.randomBytes` |
| Render  | `CORS_ORIGINS` | `https://juruena-fullstack.vercel.app`            |

> **Nota:** no plano gratuito do Render, o backend hiberna após 15 minutos de inatividade. O primeiro acesso depois disso pode levar de 30 a 60 segundos.

---

## Endpoints

### API REST (`/api`)

Autenticação em duas camadas: `auth` (JWT válido) + `checkAdmin` (role admin). Formato de erro padronizado: `{ "message": "string" }`.

| Método   | Rota                      | Auth | Role      | Descrição                   |
| -------- | ------------------------- | ---- | --------- | --------------------------- |
| `GET`    | `/api/health`             | -    | -         | Health check                |
| `POST`   | `/api/signup`             | -    | -         | Cadastro de usuário         |
| `POST`   | `/api/signin`             | -    | -         | Login (retorna JWT)         |
| `GET`    | `/api/users/me`           | ✅   | user      | Perfil do usuário logado    |
| `GET`    | `/api/places`             | -    | -         | Catálogo público de lugares |
| `POST`   | `/api/places`             | ✅   | **admin** | Cadastrar lugar             |
| `DELETE` | `/api/places/:placeId`    | ✅   | **admin** | Excluir lugar               |
| `GET`    | `/api/favorites`          | ✅   | user      | Favoritos do usuário logado |
| `POST`   | `/api/favorites/:placeId` | ✅   | user      | Favoritar lugar             |
| `DELETE` | `/api/favorites/:placeId` | ✅   | user      | Desfavoritar lugar          |

Referência técnica completa: [`backend/DOC.md`](./backend/DOC.md)

### API externa (Open-Meteo)

O componente `Weather` consome a **Open-Meteo Forecast API** (pública, sem autenticação), com requisições centralizadas em `frontend/src/services/weatherApi.js`:

```text
GET https://api.open-meteo.com/v1/forecast
```

| Parâmetro       | Valor                                                | Descrição                  |
| --------------- | ---------------------------------------------------- | -------------------------- |
| `latitude`      | `-10.318`                                            | Coordenada de Juruena - MT |
| `longitude`     | `-58.359`                                            | Coordenada de Juruena - MT |
| `current`       | `temperature_2m,apparent_temperature,weather_code`   | Dados atuais               |
| `daily`         | `weather_code,temperature_2m_max,temperature_2m_min` | Previsão diária            |
| `timezone`      | `auto`                                               | Fuso automático            |
| `forecast_days` | `4`                                                  | Hoje + 3 dias              |

- **Autenticação:** nenhuma
- **Rate limit:** 600 req/min por IP
- **Documentação oficial:** [open-meteo.com/en/docs](https://open-meteo.com/en/docs)

### Rotas do frontend (React Router v5)

| Rota         | Componente      | Protegida? | Restrição           |
| ------------ | --------------- | ---------- | ------------------- |
| `/`          | `MainPage`      | Não        | -                   |
| `/lugares`   | `PlacesPage`    | Não        | -                   |
| `/favoritos` | `FavoritesPage` | ✅         | Usuário autenticado |
| `/admin`     | `AdminPage`     | ✅         | `role === 'admin'`  |
| `*`          | `NotFoundPage`  | -          | -                   |

---

## Próximos Passos

O projeto está funcional no escopo das três fases do bootcamp (frontend, backend e integração). Evoluções planejadas:

- [ ] Google Analytics integrado ao consentimento do banner de cookies (LGPD)
- [ ] Página `/privacidade` com política de cookies completa
- [ ] Botão "Gerenciar cookies" no Footer (permitir revogar consentimento)
- [ ] Upload real de imagens no painel admin (atualmente por URL externa)
- [ ] Migração das imagens externas para armazenamento próprio (Cloudinary, S3 ou similar)
- [ ] Testes E2E com Playwright
- [ ] PWA (offline-first e instalável)
- [ ] Domínio customizado para frontend e backend

---

## Licença

MIT © 2026 Michael Ribeiro

Este projeto foi desenvolvido como parte do projeto final do bootcamp de Desenvolvimento Full-Stack da TripleTen (Sprint 19).
