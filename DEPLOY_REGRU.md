# Деплой `aikod.sergeichernenko.ru` на облако REG.RU

Timeweb больше не используем. Домен и хостинг остаются в одном месте — REG.RU.

Есть два рабочих пути. **Вариант A** проще всего и не требует сервера. **Вариант B** — если хочешь полноценный облачный сервер с автодеплоем из GitHub.

---

## Вариант A — Хостинг REG.RU (статика). Самый простой

Сайт — обычный React/Vite лендинг, на выходе просто папка `dist`. Её достаточно положить на обычный хостинг.

### 1. Собрать сайт

Локально:

```bash
npm ci
npm run build
```

Появится папка `dist` с `index.html` и `assets/`.

Если не хочешь собирать локально — сборку делает GitHub Actions (см. Вариант B, шаг 6), артефакт можно скачать со страницы workflow.

### 2. Создать поддомен

Панель REG.RU → **Хостинг** → **Сайты и домены** → **Добавить сайт/поддомен**:

- Имя: `aikod.sergeichernenko.ru`
- Корневая директория: `/www/aikod.sergeichernenko.ru`

### 3. Загрузить файлы

Файловый менеджер REG.RU (или FTP) → зайти в корневую директорию поддомена → загрузить **содержимое** папки `dist`, а не саму папку:

```text
index.html
assets/...
robots.txt
```

### 4. SPA fallback (обязательно)

На хостинге REG.RU Apache. Рядом с `index.html` создай файл `.htaccess`:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Без него прямой заход на внутренние ссылки даст 404.

### 5. SSL

REG.RU → **Хостинг** → **SSL-сертификаты** → выпустить бесплатный Let's Encrypt для `aikod.sergeichernenko.ru`. Включить редирект на HTTPS.

### 6. Отвязать домен от Lovable

Lovable → **Project Settings → Domains** → у `aikod.sergeichernenko.ru` → ⋯ → **Remove**.
В DNS REG.RU удалить A-запись `aikod` → `185.158.133.1` и TXT `_lovable.aikod`, если остались.

Обновление сайта: пересобрал `dist` → перезалил файлы. Всё.

---

## Вариант B — Облачный сервер REG.RU + Nginx + автодеплой из GitHub

Нужен, если хочешь, чтобы каждый коммит из Lovable сам обновлял сайт.

### 1. Заказать сервер

REG.RU → **Облачные серверы** → создать:

| Поле | Значение |
|------|----------|
| ОС | Ubuntu 24.04 |
| Тариф | минимальный (1 CPU / 1 GB) |
| Регион | Россия |

Получишь **IP** и **root-пароль**.

### 2. Подготовить сервер

```bash
ssh root@ТВОЙ_IP
```

Дальше одним блоком:

```bash
apt update && apt install -y nginx
mkdir -p /var/www/aikod
chown -R www-data:www-data /var/www/aikod
```

### 3. Настроить Nginx

```bash
nano /etc/nginx/sites-available/aikod
```

Содержимое:

```nginx
server {
    listen 80;
    server_name aikod.sergeichernenko.ru;

    root /var/www/aikod;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Включить:

```bash
ln -s /etc/nginx/sites-available/aikod /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 4. DNS в REG.RU

Управление DNS `sergeichernenko.ru`:

- удалить старую A-запись `aikod` (Lovable `185.158.133.1`) и TXT `_lovable.aikod`;
- добавить A-запись: имя `aikod`, значение — IP облачного сервера.

Ждать 15 минут – 2 часа.

### 5. SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d aikod.sergeichernenko.ru
```

### 6. Автодеплой из GitHub

В репозитории уже лежит `.github/workflows/deploy.yml`. Добавь секреты:
GitHub → репозиторий → **Settings → Secrets and variables → Actions → New repository secret**:

| Секрет | Значение |
|--------|----------|
| `VPS_HOST` | IP облачного сервера REG.RU |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | приватный SSH-ключ (публичный — в `~/.ssh/authorized_keys` на сервере) |

Сгенерировать ключ локально:

```bash
ssh-keygen -t ed25519 -C "deploy-aikod" -f ~/.ssh/aikod_deploy
ssh-copy-id -i ~/.ssh/aikod_deploy.pub root@ТВОЙ_IP
cat ~/.ssh/aikod_deploy   # это содержимое кладём в VPS_SSH_KEY
```

После этого каждый push в `main` собирает проект и заливает `dist` в `/var/www/aikod`.

---

## Что выбрать

- Хочешь быстро и без сервера → **Вариант A**.
- Хочешь автообновление из Lovable/GitHub → **Вариант B**.

Оба варианта полностью в РФ-инфраструктуре REG.RU, блокировок не будет.
