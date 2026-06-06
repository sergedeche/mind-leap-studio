# Деплой `aikod.sergeichernenko.ru` на Timeweb Cloud Apps

Этот же рецепт уже работает в твоих проектах **Corporate Survival Guide** и **Legacy Through Literature**. Здесь — то же самое, без лишнего.

Тип приложения: **Dockerfile**. Это критично — НЕ выбирай «Frontend / Static site / Другой JS-фреймворк», иначе Timeweb запустит свой авто-билдер и снова упадёт на `npm ci`.

---

## Шаг 1. Подключить GitHub

В Lovable: чат → `+` → **GitHub** → **Connect project** → **Create Repository**. Дальше каждый коммит из Lovable автоматически уходит в репозиторий.

## Шаг 2. Создать приложение в Timeweb

Панель Timeweb Cloud → **Apps** → **Создать приложение**:

| Поле | Значение |
|------|----------|
| Тип | **Dockerfile** |
| Источник | GitHub |
| Репозиторий | твой репозиторий |
| Ветка | `main` |
| Project directory | пусто (Dockerfile в корне) |
| Dockerfile | `Dockerfile` |
| Port | `8080` (берётся из `EXPOSE 8080`) |
| Start command | пусто (используется `CMD` из Dockerfile) |
| System dependencies | **пусто** |
| Environment variables | для этого проекта — пусто. В других сайтах добавляй все `VITE_*` из локального `.env`, иначе фронт не соберётся. |
| SPA fallback | включить (404 → `index.html`). В этом проекте уже есть свой `nginx.conf` с fallback, но галка в Timeweb не помешает. |

Тариф — минимальный.

## Шаг 3. Дождаться сборки

Timeweb сам выполнит то, что прописано в `Dockerfile`:

```
npm install --legacy-peer-deps
npm run build
nginx -g 'daemon off;'
```

Когда статус станет **Running**, открой временный домен Timeweb (вид `*.twc1.net`). Должен открыться сайт.

## Шаг 4. Привязать домен `aikod.sergeichernenko.ru`

1. В Timeweb → приложение → **Домены** → **Добавить домен** → `aikod.sergeichernenko.ru`. Timeweb покажет IP для A-записи.
2. В REG.RU (управление DNS `sergeichernenko.ru`):
   - удали старую A-запись `aikod`, если она указывает на Lovable (`185.158.133.1`);
   - удали TXT-запись `_lovable.aikod`, если есть;
   - добавь новую A-запись: имя `aikod`, значение — IP от Timeweb.
3. Подожди 15 мин – 2 часа. Timeweb сам выпустит SSL Let's Encrypt.

## Шаг 5. Отвязать домен от Lovable

Lovable → **Project Settings → Domains** → у `aikod.sergeichernenko.ru` → ⋯ → **Remove**. Превью на `*.lovable.app` продолжит работать.

## Шаг 6. Проверка автодеплоя

Поменяй что-нибудь мелкое в Lovable → коммит уйдёт в GitHub → Timeweb сам пересоберёт приложение. Через 1–2 минуты обновление будет на сайте.

---

## Если падает

- **`apt-get install ... npm ci ... exit code 100`** — выбран не тот тип приложения. Удали и создай заново как **Dockerfile**.
- **Сайт открывается, но `/route` даёт 404** — это уже исключено: в `nginx.conf` стоит SPA fallback на `index.html`.
- **Сборка зависает на `npm ci`** — мы используем `npm install --legacy-peer-deps`, она терпимее к lockfile-конфликтам.
