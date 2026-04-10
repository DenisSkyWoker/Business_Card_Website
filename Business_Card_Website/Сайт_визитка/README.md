## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd discord_clone

# Linux/Mac
python3 -m .venv venv
source .venv/bin/activate

# Windows
python -m .venv venv
.venv\Scripts\activate

pip install -r requirements.txt

# Копирование примера
cp .env.example .env

# Редактирование .env
# Обязательно измените SECRET_KEY!
openssl rand -hex 32


Запуск: сервера:
php -S localhost:8000
Остановка серверов:
pkill -f "php -S"


# Linux/Mac
ln -s ../frontend/index.html static/index.html
ln -s ../frontend/css static/css
ln -s ../frontend/js static/js

# Windows (Command Prompt как администратор)
mklink static\index.html ..\frontend\index.html
mklink /D static\css ..\frontend\css
mklink /D static\js ..\frontend\js


# Development
python main.py

# Production
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4


http://localhost:8000
или
https://localhost:8000 (если включен TLS)



📝 API Документация
После запуска сервера откройте:

    Swagger UI: http://localhost:8000/docs
    ReDoc: http://localhost:8000/redoc

🔐 Безопасность

    ✅ JWT токены с expiration
    ✅ Хеширование паролей (bcrypt)
    ✅ Rate limiting на эндпоинтах
    ✅ HTTPS/TLS поддержка
    ✅ Security headers (CSP, X-Frame-Options, etc.)
    ✅ Валидация входных данных
    ✅ Логирование событий безопасности

📱 Поддерживаемые устройства

    ✅ Desktop (Chrome, Firefox, Safari, Edge)
    ✅ Mobile (iOS Safari, Android Chrome)
    ✅ Планшеты


📄 Лицензия
MIT License
👥 Авторы
Discord Clone Project
Денис Воронцов
🤝 Contributing

    Fork репозиторий
    Создайте feature branch (git checkout -b feature/amazing-feature)
    Commit изменения (git commit -m 'Add amazing feature')
    Push в branch (git push origin feature/amazing-feature)
    Откройте Pull Request