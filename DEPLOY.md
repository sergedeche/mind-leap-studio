# Надёжный деплой сайта

> Сайт: `aikod.sergeichernenko.ru`  
> Домен остаётся на **REG.RU**. Самый стабильный вариант — не заставлять Timeweb угадывать сборку, а отдавать уже готовую статику или запускать Docker.

---

## Вариант 1 — рекомендую: Timeweb Cloud Apps через Docker

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

## Вариант 2 — самый простой: REG.RU хостинг как статический сайт

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

## Вариант 3 — GitHub Pages / Netlify / Vercel + DNS на REG.RU

Если цель — просто стабильно открыть сайт на домене, проще всего:

1. Залить проект на GitHub
2. Подключить репозиторий к Netlify или Vercel
3. Указать:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
4. В REG.RU добавить DNS-запись, которую выдаст сервис

Это обычно надёжнее Cloud Apps для обычного React/Vite сайта.

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

1. **Сначала Docker в Timeweb Cloud Apps** — потому что проект уже подготовлен под Docker, и это убирает проблему авто-детекта сборки.
2. Если Timeweb снова падает — **Netlify/Vercel** для фронта, а домен оставить на REG.RU.
3. Если нужен максимально простой ручной вариант — **REG.RU статический хостинг** и загрузка `dist`.

---

## Быстрая проверка перед деплоем

В репозитории должны остаться:

```text
package-lock.json
Dockerfile
nginx.conf
```

И не должно быть:

```text
bun.lock
bun.lockb
pnpm-lock.yaml
yarn.lock
```
