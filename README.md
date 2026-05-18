# Underground Fitness — Sales Academy

Внутренняя база знаний отдела продаж. React + Express + PostgreSQL (Prisma).

## Быстрый старт (локально)

```bash
npm install
npx prisma generate --schema backend/prisma/schema.prisma
```

### Запуск сервера БД

```bash
# Терминал 1 — backend
node backend/server.js

# Терминал 2 — frontend (Vite dev server)
npm run dev
```

Откройте http://localhost:5173

## Структура

```
├── index.html
├── vite.config.js              # Vite proxy /api → localhost:3001
├── package.json                # Frontend + backend deps
├── backend/
│   ├── server.js               # Express сервер (порт 3001)
│   ├── lib/prisma.js           # PrismaClient singleton
│   ├── routes/*
│   ├── prisma/
│   │   ├── schema.prisma       # 17 моделей
│   │   ├── seed.js             # Начальные данные
│   │   └── migrations/         # SQL миграции
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   └── pages/
└── railway.json                # Конфиг для Railway
```

## Деплой на Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Форкнуть / запушить репозиторий на GitHub
2. Создать новый проект в Railway → Deploy from GitHub repo
3. В `Variables` добавить:
   - `DATABASE_URL` — Railway предоставит PostgreSQL (или подключи свой)
   - `JWT_SECRET` — любая строка (например, `openssl rand -hex 32`)
4. Railway автоматически:
   - Установит зависимости (`npm install`)
   - Сгенерирует Prisma Client (`postinstall`)
   - Соберёт фронтенд (`npm run build`)
   - Запустит сервер (`npm start`)
5. Миграции применяются **автоматически** при каждом запуске (встроено в `npm start`)
6. После первого деплоя выполнить сид в Railway Console:
   ```
   npm run db:seed
   ```
7. Готово — Railway сам пробросит домен

## Локальный запуск с БД (через Docker)

```bash
docker run -d --name pg -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=underground -p 5432:5432 postgres:16

set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/underground

npx prisma migrate deploy --schema backend/prisma/schema.prisma
npm run db:seed
npm start
```

## Логин по умолчанию

`admin` / `admin123`
"# underground" 
