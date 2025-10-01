# 🗳️ Idea Voting App — Express + React

Полнофункциональное приложение для голосования за идеи: создание идей, голосование с ограничениями, современный UI. Проект полностью контейнеризован (Docker) с reverse-proxy и готов к продакшену.

## Стек

- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite, Bootstrap, Axios
- Инфраструктура: Docker, Docker Compose, Nginx

## Возможности

- Идеи: просмотр списка, голосование (1 голос на идею)
- Ограничения: максимум 10 голосов с одного IP
- UI: адаптивные карточки, индикаторы голосования, обработка ошибок
- API: RESTful эндпоинты с валидацией
- DevOps: автоматические миграции, seed-данные, reverse-proxy

## Быстрый старт (Docker)

Требования: установлен Docker и Docker Compose

```bash
# из корня репозитория
git clone https://github.com/yourname/idea-voting-app.git
cd idea-voting-app
docker compose up -d --build
```

Открыть в браузере:

- Клиент: http://localhost:3000
- API: http://localhost:4000/api
- Единая точка входа: http://localhost:8080

### Управление контейнерами

```bash
# статус контейнеров
docker compose ps

# логи (последние / стрим)
docker compose logs backend | tail -n 100
docker compose logs -f backend

# перезапуск/остановка/запуск
docker compose restart
docker compose stop
docker compose start

# остановить и удалить контейнеры
docker compose down

# пересобрать и поднять
docker compose up -d --build

# полная пересборка без кэша
docker compose build --no-cache && docker compose up -d

# очистка с удалением volumes (в т.ч. БД — осторожно!)
docker compose down -v
```

База данных:

- Путь в контейнере: `/var/lib/postgresql/data`
- Volume: `db_data` (персистентно)
- Подключение: `postgresql://postgres:postgres@localhost:5432/ideasdb`

## Переменные окружения

### Backend (автоматически через docker-compose.yml)

```env
DATABASE_URL=postgres://postgres:postgres@db:5432/ideasdb
```

### Frontend (динамически в коде)

- При открытии на `:3000` → API через `:8080`
- При открытии на `:8080` → относительный `/api`

## Локальная разработка (без Docker)

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API базовый путь: `http://localhost:4000/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Открыть: http://localhost:5173

## API (основные эндпоинты)

- `GET    /api/ideas` — список идей с флагом голосования
- `POST   /api/ideas/:id/vote` — проголосовать за идею

Пример ответа списка:

```json
[
  {
    "id": 1,
    "title": "Новая функция",
    "description": "Описание идеи",
    "votes": 5,
    "voted": false,
    "createdAt": "2025-09-30T10:00:00.000Z"
  }
]
```

Примеры ошибок:

- `409 Conflict` — повторный голос за ту же идею
- `409 Conflict` — превышен лимит голосов с IP (10)

## Структура проекта (ключевые части)

```
backend/src
  controllers/ideasController.ts     # обработчики запросов
  services/voteService.ts           # бизнес-логика голосования
  routes/ideas.ts                   # маршруты API
  db/prisma.ts                      # подключение к БД
  utils/ip.ts                       # извлечение IP (с учётом proxy)
  app.ts                            # настройка Express, middleware
  server.ts                         # запуск сервера

frontend/src
  components/IdeaList.tsx           # список идей с голосованием
  api.ts                            # axios client с динамическим baseURL
  App.tsx                           # главный компонент
  main.tsx                          # точка входа

prisma/
  schema.prisma                     # схема БД (Idea, Vote)
  migrations/                       # миграции
  seed.ts                           # начальные данные

nginx.conf                          # reverse-proxy конфигурация
docker-compose.yml                  # оркестрация сервисов
```

## Скрипты

### Backend

- `npm run dev` — dev-сервер с hot-reload
- `npm run build` — сборка TypeScript
- `npm start` — запуск production-сервера

### Frontend

- `npm run dev` — Vite dev-сервер
- `npm run build` — сборка для production
- `npm run preview` — предпросмотр сборки

## Конвенции и решения

- Голосование: 1 голос на идею, максимум 10 голосов с IP
- IP-адрес: извлечение из `X-Forwarded-For` (поддержка reverse-proxy)
- UI: оптимистичные обновления, обработка конфликтов
- API: RESTful, JSON-ответы, HTTP-статусы
- БД: Prisma ORM, автоматические миграции, seed-данные
- Прокси: Nginx для единой точки входа (`/` → frontend, `/api` → backend)

## Полезное

Prisma Studio (просмотр БД):

```bash
cd backend
npx prisma studio
```

Проверка API:

```bash
# Список идей
curl http://localhost:4000/api/ideas

# Голос за идею
curl -X POST http://localhost:4000/api/ideas/1/vote
```
