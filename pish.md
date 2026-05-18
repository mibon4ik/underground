# Инструкция по деплою

## Содержание
- [Railway](#railway-рекомендуемый-способ)
- [Vercel + Railway (альтернатива)](#vercel--railway)
- [Переменные окружения](#переменные-окружения)
- [Проверка после деплоя](#проверка-после-деплоя)

---

## Railway (рекомендуемый способ)

Всё в одном — и фронтенд, и бэкенд, и база данных.

### 1. Подготовка

```bash
# Убедись, что есть гит-репозиторий
git init
git add .
git commit -m "initial"
```

### 2. Создать проект на Railway

1. Зайди на https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Выбери свой репозиторий
4. Railway автоматически запустит деплой (упадёт с ошибкой — это нормально, нет БД)

### 3. Добавить PostgreSQL

1. В проекте Railway нажми **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway создаст БД и автоматически добавит переменную `DATABASE_URL` в окружение

### 4. Добавить переменные

В разделе **Variables** твоего сервиса (не БД) добавь:

| Variable | Значение | Обязательно |
|---|---|---|
| `JWT_SECRET` | Любая строка (например, `my-super-secret-key-123`) | Да |
| `PORT` | `3001` | Нет (Railway сам подставит) |
| `DATABASE_URL` | Postgres URI | Да (автоматически, если БД в том же проекте) |

Создать `JWT_SECRET` можно командой:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Переменные окружения

В разделе **Variables** сервиса обязательно добавь `JWT_SECRET`.

> **Миграции применяются автоматически** при каждом запуске сервера — команда `npx prisma migrate deploy` встроена в `npm start`.

### 6. Заполнить базу начальными данными

После первого успешного деплоя нажми **"Redeploy"** — теперь, когда БД есть, сервер запустится, миграции применятся, но данных ещё нет.

Открой **Railway Console** (вкладка терминала) и выполни:

```bash
npm run db:seed
```

После этого появится пользователь `admin` / `admin123` и все стандартные настройки.

### 7. Готово

Railway выдаст домен вида `https://underground-production.up.railway.app`. Открой в браузере.

---

## Vercel + Railway

Если хочешь фронтенд на Vercel (быстрее, CDN), а бэкенд на Railway.

### 1. Бэкенд на Railway — шаги с 1 по 4 из [Railway](#railway-рекомендуемый-способ)

Дополнительно в Variables Railway добавь:

| Variable | Значение |
|---|---|
| `CORS_ORIGIN` | `https://твой-домен.vercel.app` |

### 2. Фронтенд на Vercel

В корне проекта создай `vercel.json` (если его нет):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://твой-бэкенд.railway.app/api/$1"
    }
  ]
}
```

> **Важно:** Указывай домен **без `/api`** — код сам добавит `/api` в конце.
> Например: `https://мой-бэкенд.railway.app`, а не `https://мой-бэкенд.railway.app/api`.

### 3. Переменные на Vercel

В Project Settings → Environment Variables добавь:

| Variable | Значение |
|---|---|
| `VITE_API_URL` | `https://твой-бэкенд.railway.app` |

### 4. Деплой на Vercel

1. Зайди на https://vercel.com
2. "Add New" → "Project"
3. Выбери репозиторий
4. Framework Preset: **Vite**
5. Root Directory: **./** (корень)
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Нажми "Deploy"

---

## Переменные окружения

### Полный список

| Variable | Где | Для чего |
|---|---|---|
| `DATABASE_URL` | Railway (авто) | Строка подключения к PostgreSQL |
| `JWT_SECRET` | Railway | Секретный ключ для JWT-токенов |
| `PORT` | Railway (опц.) | Порт сервера (по умолч. 3001) |
| `VITE_API_URL` | Vercel | URL бэкенда для API-запросов |
| `CORS_ORIGIN` | Railway (опц.) | Разрешённый домен для CORS (если фронтенд отдельно) |

### Примеры значений

```env
DATABASE_URL=postgresql://postgres:abc123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
JWT_SECRET=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
PORT=3001
```

---

## Проверка после деплоя

### Healthcheck

```bash
curl https://твой-домен.railway.app/api/health
# → {"status":"ok","timestamp":"2026-05-18T..."}
```

### Админка

Открой сайт, нажми `Ctrl+Shift+A` или кнопку **⚙️ Админ** в сайдбаре.
Логин: `admin`, пароль: `admin123`.

### API

```bash
# Получить данные (например, тему)
curl https://твой-домен.railway.app/api/data/theme

# Логин
curl -X POST https://твой-домен.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

---

## Возможные проблемы

| Проблема | Решение |
|---|---|
| `prisma: error: Environment variable not found: DATABASE_URL` | Убедись, что переменная `DATABASE_URL` добавлена в Variables сервиса (не в корень проекта Railway, а именно в сервис) |
| 404 при открытии сайта | Проверь, что `npm run build` выполнен и папка `dist/` существует |
| API отвечает 502 | Проверь логи Railway — возможно, не применились миграции |
| `JWT_SECRET` not set | Добавь переменную `JWT_SECRET` в Railway Variables |
| CORS ошибка в браузере | Если фронтенд и бэкенд на разных доменах, обнови `CORS_ORIGIN` |
