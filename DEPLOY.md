# Деплой на Timeweb Cloud

## Быстрый старт (Timeweb Cloud Apps — рекомендуется)

1. **Подключи репозиторий** в Timeweb Cloud → Apps → Frontend
2. **Укажи настройки:**
   - Фреймворк: Vite
   - Команда сборки: `npm run build`
   - Директория сборки: `dist`
3. **Добавь переменные окружения** (если нужны)
4. **Нажми Deploy** — приложение соберётся и запустится автоматически
5. **Привяжи домен** `aikod.sergeichernenko.ru` в разделе Домены

## Альтернатива: VDS + Nginx

Если предпочитаешь VDS, используй конфигурацию из `nginx.conf` в этом репозитории:

```bash
# На сервере
sudo apt update && sudo apt install nginx
sudo cp nginx.conf /etc/nginx/sites-available/aikod
sudo ln -s /etc/nginx/sites-available/aikod /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## SPA-роутинг

Сайт использует клиентский роутинг (React Router). Nginx конфигурация уже настроена на возврат `index.html` для всех маршрутов.
