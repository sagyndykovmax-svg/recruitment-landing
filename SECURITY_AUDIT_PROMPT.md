# Промпт: Аудит безопасности Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`.

Стек: Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO + Docker Compose. Фронтенд: React 18 + TypeScript. Telegram-бот. Интеграции: OpenAI, Notion, MinIO (S3).

Система обрабатывает **персональные данные** (имена, телефоны, паспорта, фото, резюме) и **финансовые данные** (в будущем). Данные кандидатов из стран СНГ, работодатели из ОАЭ, Саудовской Аравии, Катара, Кувейта.

---

## Задача

Провести полный аудит безопасности существующего кода и конфигурации. **НЕ менять код** — только найти проблемы, оценить критичность и выдать отчёт с конкретными рекомендациями.

Формат выхода: **отчёт** с таблицей находок (severity, location, problem, fix).

---

## 1. Проверка конфигурации Django

### Файлы для проверки:
- `backend/config/settings/base.py`
- `backend/config/settings/production.py`
- `backend/config/settings/local.py`

### Что проверить:

| Параметр | Ожидание | Критичность |
|----------|----------|-------------|
| `DEBUG` | `False` в production | 🔴 Critical |
| `SECRET_KEY` | Не дефолтный, не в коде, из env | 🔴 Critical |
| `ALLOWED_HOSTS` | Конкретные домены, НЕ `['*']` | 🔴 Critical |
| `CORS_ALLOWED_ORIGINS` | Конкретный домен фронтенда, НЕ `*` | 🔴 Critical |
| `CORS_ALLOW_ALL_ORIGINS` | `False` | 🔴 Critical |
| `CSRF_COOKIE_SECURE` | `True` в production | 🟡 High |
| `SESSION_COOKIE_SECURE` | `True` в production | 🟡 High |
| `SECURE_SSL_REDIRECT` | `True` в production | 🟡 High |
| `SECURE_HSTS_SECONDS` | > 0 (рекомендуется 31536000) | 🟡 High |
| `SECURE_HSTS_INCLUDE_SUBDOMAINS` | `True` | 🟡 High |
| `SECURE_CONTENT_TYPE_NOSNIFF` | `True` | 🟢 Medium |
| `X_FRAME_OPTIONS` | `DENY` или `SAMEORIGIN` | 🟢 Medium |
| `SECURE_BROWSER_XSS_FILTER` | `True` | 🟢 Medium |
| `SESSION_COOKIE_HTTPONLY` | `True` | 🟢 Medium |
| `CSRF_COOKIE_HTTPONLY` | `True` | 🟢 Medium |
| `PASSWORD_HASHERS` | Argon2 или PBKDF2 (не MD5) | 🟡 High |
| `AUTH_PASSWORD_VALIDATORS` | Включены (длина, сложность) | 🟡 High |
| База данных | Пароль не дефолтный, не 'postgres' | 🔴 Critical |
| Redis | Требует пароля или слушает только localhost | 🟡 High |
| `LOGGING` | Не логируются секреты/токены | 🟡 High |

---

## 2. Проверка секретов и переменных окружения

### Файлы для проверки:
- `.env`, `.env.example`, `.env.production`
- `docker-compose.yml`, `docker-compose.prod.yml`
- `.gitignore`
- Вся история git: `git log --all --diff-filter=A -- '*.env'`

### Что проверить:

| Проверка | Как | Критичность |
|----------|-----|-------------|
| `.env` в `.gitignore` | Grep `.gitignore` | 🔴 Critical |
| Секреты в git history | `git log -p --all -S "SECRET_KEY"`, `-S "OPENAI_API_KEY"`, `-S "password"` | 🔴 Critical |
| Хардкод секретов в коде | Grep по всему backend/frontend: `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD` (не из env) | 🔴 Critical |
| Сильные пароли | PostgreSQL, Redis, MinIO — не дефолтные, не короткие | 🟡 High |
| Разделение env | Разные SECRET_KEY и пароли для dev/prod | 🟡 High |

**Команды для поиска:**
```bash
# Секреты в коде
grep -rn "SECRET_KEY\s*=" backend/ --include="*.py" | grep -v "os.environ\|getenv\|env("
grep -rn "password\s*=" backend/ --include="*.py" | grep -v "os.environ\|getenv\|env(\|#\|Password"
grep -rn "api_key\s*=" backend/ --include="*.py" | grep -iv "os.environ\|getenv\|env("
grep -rn "token\s*=" backend/ --include="*.py" | grep -iv "os.environ\|getenv\|env(\|csrf\|Cookie"

# .env в git
git log --all --name-only | grep -i "\.env"

# Дефолтные пароли в docker-compose
grep -n "password\|POSTGRES_PASSWORD\|MINIO_SECRET" docker-compose*.yml
```

---

## 3. Проверка API-эндпоинтов

### Файлы для проверки:
- `backend/apps/recruiters/views.py`
- `backend/apps/*/urls.py`
- Все ViewSets и APIViews

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Все эндпоинты требуют авторизации | Найти все `AllowAny`, `permission_classes = []` | 🔴 Critical |
| Rate limiting на логин | `/api/login/` — есть ли throttling? | 🟡 High |
| Rate limiting на публичные эндпоинты | Employer form, public vacancies | 🟡 High |
| Фильтрация queryset | В ViewSets — проверить что `get_queryset()` фильтрует по пользователю (не отдаёт чужие данные) | 🔴 Critical |
| IDOR (Insecure Direct Object Reference) | `/api/applications/123/` — может ли пользователь A получить данные пользователя B? | 🔴 Critical |
| Массовое присвоение (Mass Assignment) | Serializers — какие поля writable? Можно ли PATCH `is_superuser=True`? | 🔴 Critical |
| File upload валидация | Resume upload — проверяется ли тип файла, размер? | 🟡 High |
| SQL injection | Поиск `raw()`, `extra()`, f-string в ORM queries | 🔴 Critical |
| XSS в данных кандидатов | HTML в `full_name`, `motivation_text` — экранируется ли при рендере? | 🟡 High |

**Команды:**
```bash
# AllowAny в views
grep -rn "AllowAny\|permission_classes\s*=\s*\[\]" backend/apps/ --include="*.py"

# Raw SQL
grep -rn "\.raw(\|\.extra(\|cursor\.execute" backend/apps/ --include="*.py"

# F-string в ORM
grep -rn "f\".*filter\|f\".*exclude\|f\".*annotate" backend/apps/ --include="*.py"

# File upload без валидации
grep -rn "request\.FILES\|InMemoryUploadedFile\|UploadedFile" backend/apps/ --include="*.py"
```

---

## 4. Проверка Telegram-бота

### Файлы для проверки:
- `backend/apps/telegram_bot/orchestration.py`
- `backend/apps/telegram_bot/services.py`

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Webhook секрет | Проверяется ли `X-Telegram-Bot-Api-Secret-Token` в webhook? | 🟡 High |
| Webhook IP | Ограничен ли webhook только IP Telegram (149.154.160.0/20, 91.108.4.0/22)? | 🟢 Medium |
| Инъекция через сообщения | Может ли кандидат отправить текст, который выполнится как код? | 🟡 High |
| Bot token в логах | Не логируется ли токен бота? | 🟡 High |
| Команды без валидации | `/start` с параметром — валидируется ли vacancy slug? | 🟢 Medium |

---

## 5. Проверка MinIO / Файлы

### Файлы для проверки:
- `backend/apps/media_assets/storage.py`
- Docker Compose: MinIO конфигурация

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Bucket policy | `recruitment-media` — private или public? | 🔴 Critical |
| MinIO credentials | Не дефолтные (minioadmin/minioadmin)? | 🔴 Critical |
| MinIO console | Порт 9001 — доступен извне? Закрыт файрволом? | 🟡 High |
| Presigned URL TTL | Какой TTL? Рекомендуется ≤1 час для PII | 🟡 High |
| Файл валидация | Проверяется ли MIME type при загрузке? Ограничен ли размер? | 🟡 High |
| Путь traversal | Можно ли через API загрузить файл в произвольный путь? | 🔴 Critical |

---

## 6. Проверка Docker / Infrastructure

### Файлы для проверки:
- `docker-compose.yml`, `docker-compose.prod.yml`
- `Dockerfile` (backend, frontend)
- Nginx конфигурация (если есть)

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Открытые порты | PostgreSQL (5432), Redis (6379), MinIO (9000/9001) — доступны извне? | 🔴 Critical |
| Docker user | Контейнеры запускаются от root? | 🟢 Medium |
| Образы | Используются ли latest-тэги? (лучше фиксированные версии) | 🟢 Medium |
| Volumes | Данные PostgreSQL/MinIO на volume? (не теряются при перезапуске) | 🟡 High |
| Healthchecks | Есть ли healthcheck для backend, postgres, redis? | 🟢 Medium |
| Nginx headers | Security headers (X-Frame-Options, CSP, HSTS) | 🟡 High |
| Nginx rate limiting | Настроен ли rate limiting для API? | 🟡 High |

**Команды:**
```bash
# Открытые порты в docker-compose
grep -n "ports:" docker-compose*.yml -A 2

# Root user в Dockerfile
grep -n "USER" backend/Dockerfile frontend/Dockerfile
```

---

## 7. Проверка фронтенда

### Файлы для проверки:
- `frontend/src/api.ts`
- Все файлы в `frontend/src/`

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Токен хранение | Где хранится auth token? localStorage (уязвим к XSS) или httpOnly cookie? | 🟡 High |
| XSS в рендере | Используется ли `dangerouslySetInnerHTML`? Рендерятся ли raw данные кандидатов? | 🟡 High |
| API URL в коде | Не захардкожен ли production URL? | 🟢 Medium |
| Source maps в production | Отключены ли source maps в production build? | 🟢 Medium |
| Console.log | Не логируются ли чувствительные данные в console? | 🟢 Medium |

**Команды:**
```bash
grep -rn "dangerouslySetInnerHTML" frontend/src/
grep -rn "localStorage\|sessionStorage" frontend/src/
grep -rn "console\.log" frontend/src/ --include="*.tsx" --include="*.ts" | head -20
```

---

## 8. Проверка зависимостей

### Что проверить:

```bash
# Python — уязвимые пакеты
cd backend && pip audit 2>/dev/null || pip install pip-audit && pip audit

# npm — уязвимые пакеты
cd frontend && npm audit

# Outdated packages
cd backend && pip list --outdated | head -20
cd frontend && npm outdated
```

---

## 9. Проверка OpenAI / AI безопасность

### Файлы для проверки:
- `backend/apps/ai_orchestration/chains.py`
- `backend/apps/ai_orchestration/orchestrator.py`

### Что проверить:

| Проверка | Детали | Критичность |
|----------|--------|-------------|
| Prompt injection | Может ли кандидат через сообщение боту манипулировать AI-промптом? | 🟡 High |
| PII в логах | Логируются ли полные промпты с данными кандидатов? | 🟡 High |
| API key exposure | OpenAI key не утекает в ошибках/логах? | 🔴 Critical |
| Token limit | Ограничен ли размер текста, отправляемого в OpenAI? (8000 char limit уже есть) | 🟢 Medium |
| Error handling | Что происходит если OpenAI API недоступен? Не падает ли бот? | 🟢 Medium |

---

## 10. Формат отчёта

Выдать результат в виде таблицы:

```markdown
## Результаты аудита безопасности

### 🔴 Critical (исправить немедленно)

| # | Файл:строка | Проблема | Рекомендация |
|---|-------------|----------|--------------|
| 1 | docker-compose.yml:15 | PostgreSQL порт 5432 открыт наружу | Убрать из ports, оставить только в expose |
| 2 | settings/base.py:12 | DEBUG = True | Вынести в env, убедиться что False в prod |

### 🟡 High (исправить в ближайшую неделю)

| # | Файл:строка | Проблема | Рекомендация |
|---|-------------|----------|--------------|
| 3 | ... | ... | ... |

### 🟢 Medium (запланировать)

| # | Файл:строка | Проблема | Рекомендация |
|---|-------------|----------|--------------|
| 4 | ... | ... | ... |

### ✅ Что уже хорошо

- Django CSRF protection — включена
- ...

### Рекомендуемый порядок исправлений

1. ...
2. ...
```

---

## Важные правила для аудитора

1. **НЕ менять код** — только читать и искать проблемы
2. **Конкретные файлы и строки** — каждая находка должна содержать путь к файлу
3. **Реальные рекомендации** — не абстрактные "улучшить безопасность", а конкретные изменения
4. **Приоритизация** — Critical → High → Medium, чтобы знать что чинить первым
5. **Не паниковать** — большинство проектов имеют 5–10 medium issues, это нормально
6. **Проверить ВСЕ пункты выше** — не пропускать секции
