# Надёжный деплой сайта

> Сайт: `aikod.sergeichernenko.ru`  
> Домен остаётся на **REG.RU**. Самый стабильный вариант — не заставлять Timeweb угадывать сборку, а отдавать уже готовую статику или запускать Docker.

---

## Что было не так по логу

На скрине Timeweb запускает не Docker, а свой авто-билдер:

```text
if [ -f yarn.lock ]; then ... elif [ -f package-lock.json ]; then npm ci --verbose ...
```

И он падает на `npm ci`. Причины были две:

1. `package-lock.json` не совпадал с `package.json` — это ломает `npm ci`.
2. В проект снова попал `bun.lock` — Timeweb может из-за него неправильно определять сборку.

Я синхронизировал `package-lock.json`, убрал `bun.lock` и добавил lock-файлы других менеджеров в `.gitignore`. После этого `npm ci` проходит локально.

---

## Вариант 1 — рекомендую сейчас: Netlify или Vercel + DNS на REG.RU

Это самый простой путь для обычного React/Vite сайта. Timeweb сейчас тратит время на авто-сборку, а Netlify/Vercel такие проекты деплоят стабильнее.

В репозиторий добавлены готовые конфиги:

- `netlify.toml`
- `vercel.json`

### Netlify

1. Зайди в Netlify → **Add new site** → **Import an existing project**.
2. Подключи GitHub-репозиторий.
3. Настройки должны подтянуться автоматически, но если спросит:

| Поле | Значение |
|------|----------|
| **Build command** | `npm ci && npm run build` |
| **Publish directory** | `dist` |
| **Node version** | `20` |

4. После успешного деплоя открой временный домен Netlify.
5. В Netlify добавь домен `aikod.sergeichernenko.ru` и скопируй DNS-запись, которую он выдаст.
6. В REG.RU добавь эту DNS-запись для поддомена `aikod`.

### Vercel

1. Зайди в Vercel → **Add New Project**.
2. Импортируй GitHub-репозиторий.
3. Framework: **Vite**.
4. Настройки из `vercel.json` должны подхватиться автоматически:
   - Build command: `npm ci && npm run build`
   - Output directory: `dist`
5. После деплоя добавь домен `aikod.sergeichernenko.ru` и пропиши DNS в REG.RU.

---

## Вариант 2 — если оставаться на Timeweb: только Docker-приложение

Этот способ обходится без авто-детекта React/npm/bun в Timeweb. Timeweb просто собирает Docker-образ по `Dockerfile`.

### 1. В GitHub должны быть эти файлы

- `Dockerfile`
- `nginx.conf`
- `package.json`
- `package-lock.json`
- исходники проекта

Файла `bun.lock` быть не должно.

### 2. Настройки в Timeweb Apps

Создай приложение так:

| Поле | Значение |
|------|----------|
| **Источник** | GitHub repository |
| **Тип / Framework** | `Dockerfile` / `Docker` |
| **Ветка** | `main` |
| **Dockerfile** | `Dockerfile` |
| **Порт приложения** | `80` |

Если Timeweb просит команды сборки — оставь пустыми. Docker сам выполнит:

```bash
npm ci
npm run build
```

### 3. После запуска

Открой временный адрес Timeweb. Если он работает — привязывай домен.

---

## Вариант 3 — самый простой вручную: REG.RU хостинг как статический сайт

Если Timeweb Apps продолжает ломаться, можно вообще не использовать Cloud Apps.

### 1. Собрать сайт локально или в Lovable/GitHub Actions

Команды:

```bash
npm ci
npm run build
```

На выходе появится папка `dist`.

### 2. Загрузить содержимое `dist`

В REG.RU хостинге / файловом менеджере загрузи **содержимое** папки `dist`, не саму папку:

```text
index.html
assets/...
```

Обычно путь выглядит как:

```text
/public_html/aikod/
```

или отдельная папка под поддомен.

### 3. SPA fallback

Для React нужен fallback на `index.html`. Если на REG.RU Apache, добавь файл `.htaccess` рядом с `index.html`:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## DNS для REG.RU

Домен у тебя на REG.RU, поэтому DNS меняем там.

Для поддомена:

```text
aikod.sergeichernenko.ru
```

Если хостинг дал IP:

| Тип | Имя | Значение |
|-----|-----|----------|
| `A` | `aikod` | IP сервера |

Если хостинг дал CNAME:

| Тип | Имя | Значение |
|-----|-----|----------|
| `CNAME` | `aikod` | host.example.com |

Без `https://`, без слэша в конце.

---

## Что я бы выбрал сейчас

Я бы пошёл так:

1. **Netlify** — быстрее всего завести и привязать поддомен.
2. **Vercel** — такой же надёжный вариант.
3. **Timeweb Docker** — только если принципиально нужно остаться в Timeweb Apps.
4. **REG.RU статический хостинг** — если хочется вообще без сборки на сервере.

---

## Быстрая проверка перед деплоем

В репозитории должны остаться:

```text
package-lock.json
Dockerfile
nginx.conf
netlify.toml
vercel.json
.npmrc
```

И не должно быть:

```text
bun.lock
bun.lockb
pnpm-lock.yaml
yarn.lock
```
