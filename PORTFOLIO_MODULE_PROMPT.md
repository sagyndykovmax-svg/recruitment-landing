# Промпт: Модуль «Портфолио» для Legacy HR Bot

## Контекст

Стек: Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO. Фронтенд: React 18 + TS + shadcn/ui. Telegram-бот интегрирован.

Кандидаты в сфере Beauty (nail technicians, lashmakers, hairstylists), а также повара, модели и другие позиции — присылают портфолио своих работ. Сейчас фото попадают в MediaAsset как тип `portfolio`, но:
- Нет удобного просмотра/редактирования
- Нет возможности загрузить фото с Instagram
- Нет публичной ссылки на портфолио для отправки работодателю
- Нет возможности рекрутеру самому загружать фото

---

## Задача

Добавить полноценный модуль **«Portfolio»**:

1. **Telegram-бот** — кандидат отправляет фото или ссылку на Instagram
2. **Instagram-парсер** — скачивание фото из открытого аккаунта
3. **Дашборд** — просмотр, редактирование, удаление, ручная загрузка
4. **Публичная ссылка** — для отправки работодателю

---

## 1. Telegram-бот: сбор портфолио

### Текущий flow (шаг 4 — Опыт и фото):

Бот уже спрашивает портфолио у Beauty-кандидатов. Нужно расширить:

### Новый flow (после основного фото):

```
Бот: Отправьте фотографии ваших работ (портфолио).

Вы можете:
📷 Отправить фото прямо сюда (до 20 штук)
📱 Отправить ссылку на Instagram

[📷 Загрузить фото]  [📱 Отправить Instagram]  [⏭ Пропустить]
```

### Вариант A — Фото напрямую:

```
Бот: Отправляйте фото по одному или несколько сразу.
Когда закончите, нажмите «Готово».

[Кандидат отправляет фото...]
[Кандидат отправляет ещё...]

Бот: Получено 8 фото ✅
[✅ Готово]  [📷 Ещё фото]
```

- Каждое фото сохраняется как `MediaAsset(type='portfolio')` → MinIO
- Поддержка: отправка по одному, альбомом (media group), файлом
- Без ограничений на количество файлов
- Telegram сжимает фото — сохранять в максимальном доступном качестве (`photo[-1]` — наибольший размер)

### Вариант B — Instagram:

```
Бот: Отправьте ссылку на ваш Instagram-аккаунт.
Например: https://instagram.com/your_username

Кандидат: https://instagram.com/nails_by_aigul

Бот: ⏳ Проверяю аккаунт...
```

**Если аккаунт открытый:**
```
Бот: ✅ Аккаунт найден: @nails_by_aigul
Найдено: 45 публикаций в ленте, 12 активных сторис.

Загружаю всё из ленты, сторис и Reels...
⏳ Лента... (15/50)
⏳ Лента... (50/50)
⏳ Сторис... (12/12)
⏳ Reels... (8/8)
✅ Загружено 70 файлов! (50 лента + 12 сторис + 8 Reels)

Хотите добавить ещё фото вручную?
[📷 Добавить ещё]  [✅ Готово]
```

**Если аккаунт закрытый:**
```
Бот: ❌ Аккаунт @nails_by_aigul закрыт (приватный).

Чтобы мы могли скачать ваши работы, пожалуйста:
1. Откройте Instagram
2. Настройки → Конфиденциальность → Закрытый аккаунт → Выключите
3. Подождите 1–2 минуты
4. Нажмите кнопку ниже

[🔄 Проверить снова]  [📷 Загрузить фото вручную]  [⏭ Пропустить]
```

**Если ссылка невалидная:**
```
Бот: ❌ Не удалось найти аккаунт по этой ссылке.
Проверьте правильность ссылки и отправьте снова.
```

### Сохранение Instagram-данных:
- `Candidate.instagram_url` — URL профиля
- Фото скачиваются в MinIO как `MediaAsset(type='portfolio', source='instagram')`
- Сохраняется оригинальный URL поста (`media_asset.source_url`)

---

## 2. Instagram-парсер

### Сервис: `backend/apps/portfolio/services/instagram.py`

**Функционал:**
1. Принимает username или URL профиля
2. Проверяет: аккаунт открыт или закрыт
3. Если открыт — скачивает **ВСЕ фото из ленты** (все посты, включая карусели) + **ВСЕ активные сторис**
4. Скачивает в максимальном разрешении
5. Сохраняет каждое фото в MinIO с пометкой источника (`feed` или `story`)
6. Возвращает список скачанных MediaAsset

**Что скачивается:**

| Тип контента | Что берём | Примечания |
|-------------|-----------|------------|
| **Посты (лента)** | Все фото из всех постов | Карусели — каждое фото отдельно |
| **Сторис** | Все активные (не просроченные) | Сторис живут 24 часа — скачиваем сразу |
| **Reels** | Скачиваем видео целиком (.mp4) | Reels часто содержат лучшие работы (процесс, результат) |
| **Видео в постах** | Скачиваем видео целиком (.mp4) | Таймлапсы работ, до/после |
| **IGTV** | Пропускаем | Не релевантно для портфолио |

**Подход к парсингу (варианты, по приоритету):**

1. **Instaloader** (Python-библиотека, `pip install instaloader`) — скачивает фото из публичных аккаунтов без авторизации. Поддерживает ленту и сторис. Простой, но Instagram может блокировать при частом использовании.

2. **RapidAPI Instagram Scraper** — платный API ($10–50/мес), стабильнее. Отдельные эндпоинты для feed и stories.

3. **Apify Instagram Scraper** — actor на Apify, платный, но надёжный. Поддерживает stories.

**Рекомендация:** начать с Instaloader (бесплатный, поддерживает и ленту, и сторис), если начнёт блокировать — переключиться на платный API.

**Ограничения и защита:**
- Rate limiting: не чаще 1 запроса Instagram на кандидата в 5 минут
- Без лимитов — скачиваем ВСЁ (лента, сторис, Reels, видео)
- Скачивание через Celery task (не блокировать бот)
- Progress: бот обновляет сообщение с прогрессом каждые 10 файлов
- Если Instagram недоступен — fallback на ручную загрузку
- Без таймаута — задача работает до завершения, даже для больших аккаунтов

**Celery task:**
```python
@shared_task
def download_instagram_portfolio(application_id, instagram_url):
    """Скачать ВСЕ фото из ленты и сторис Instagram."""
    # 1. Парсить username из URL
    # 2. Проверить: аккаунт открыт?
    # 3. Скачать ВСЕ фото из ленты (включая карусели)
    # 4. Скачать ВСЕ активные сторис
    # 5. Сохранить каждое в MinIO как PortfolioPhoto(source='instagram')
    #    - feed фото: source_type='instagram_feed'
    #    - stories: source_type='instagram_story'
    # 6. Обновить Portfolio.instagram_url, instagram_last_synced
    # 7. Отправить сообщение в Telegram: "✅ Загружено X фото (Y из ленты + Z из сторис)"
    pass
```

**Повторная синхронизация:**
- Кнопка "🔄 Обновить из Instagram" в дашборде — скачивает только НОВЫЕ фото (которых ещё нет в портфолио, проверка по source_url)
- Новые сторис добавляются, старые (удалённые из Instagram) помечаются но НЕ удаляются из портфолио

---

## 3. Дашборд: кнопка «Edit Portfolio»

### В `ApplicationDetailPage` — новая кнопка в toolbar:

Рядом с существующей "Edit Resume":

```
[✏️ Edit Resume]  [🖼 Edit Portfolio]  [📥 Download DOCX]
```

### Страница / Sheet «Edit Portfolio» (`/applications/:id/portfolio`)

**Или:** Sheet (shadcn) справа — чтобы не уходить со страницы заявки.

---

### Верхняя панель:

```
🖼 Портфолио — Айгуль К. (Nail Master)
Всего: 78 файлов  │  Telegram: 8  │  Лента: 45 (фото) + 5 (видео)  │  Сторис: 12  │  Reels: 8  │  Вручную: 0

[📎 Загрузить фото]  [📱 Загрузить из Instagram]  [🔗 Скопировать ссылку]
```

- **«Загрузить фото»** — file input (multiple), drag & drop
- **«Загрузить из Instagram»** — Dialog: ввести URL → Celery task → обновление
- **«Скопировать ссылку»** — копирует публичную ссылку на портфолио

---

### Галерея фото:

Grid 3–4 колонки. Каждое фото:

```
┌─────────────┐
│             │
│   [ФОТО]    │
│             │
├─────────────┤
│ 📷 Telegram  │  ← источник (Telegram / Instagram / Manual)
│ 15.03.2026  │  ← дата загрузки
│ [👁] [🗑]    │  ← просмотр / удалить
└─────────────┘
```

- **Клик по фото** → полноразмерный просмотр (Lightbox / Dialog)
- **Удалить** → подтверждение → soft delete (или hard delete из MinIO)
- **Drag & drop** для изменения порядка фото (первое фото = обложка портфолио)
- **Фильтр по источнику:** All / Telegram / Instagram Feed / Instagram Stories / Instagram Reels / Manual
- **Фильтр по типу:** All / Photos / Videos
- Видео в галерее: показывать превью-кадр с иконкой ▶️, клик → воспроизведение в lightbox

---

### Ручная загрузка рекрутером:

Кнопка **«Загрузить фото»**:
- File input: accept `image/*`
- Multiple files
- Drag & drop зона
- Превью перед загрузкой
- Прогресс-бар загрузки
- Ограничение: макс 10 файлов за раз, макс 10MB каждый

Это работает для **любой позиции** — не только Beauty. Повар может загрузить фото блюд, модель — фото с показов.

---

## 4. Публичная ссылка на портфолио

### URL: `https://site.com/portfolio/:token`

- **Token** — уникальный, не угадываемый (UUID или nanoid)
- Генерируется при создании портфолио
- Не содержит ID кандидата (безопасность)
- Можно деактивировать (если работодатель уже посмотрел)

### Публичная страница (без авторизации):

```
┌─────────────────────────────────────────────┐
│          Legacy — Портфолио             │
│                                             │
│  Nail Master                                │
│  Опыт: 3 года                              │
│                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │               │
│  └────┘ └────┘ └────┘ └────┘               │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │               │
│  └────┘ └────┘ └────┘ └────┘               │
│                                             │
│  ┌────────────────────────────────────┐     │
│  │  Заинтересовал кандидат?           │     │
│  │  [📱 Связаться с Legacy]      │     │
│  └────────────────────────────────────┘     │
│                                             │
│  © Legacy 2026                         │
└─────────────────────────────────────────────┘
```

**Что показывается:**
- Позиция кандидата (НЕ имя, НЕ телефон — до найма)
- Опыт работы (количество лет)
- Фотографии работ (grid, кликабельные → lightbox)
- Кнопка «Связаться с Legacy» → WhatsApp или форма

**Что НЕ показывается:**
- Имя кандидата
- Телефон, email
- Фото лица
- Любые персональные данные

### Настройки публичной ссылки (в дашборде):

```
Публичная ссылка:
  🔗 https://site.com/portfolio/abc123xyz
  [📋 Копировать]  [🔄 Сгенерировать новую]  [❌ Деактивировать]

Что показывать:
  ☑ Позиция
  ☑ Опыт (лет)
  ☐ Имя кандидата
  ☐ Instagram ссылка
```

---

## 5. Интеграция с отправкой работодателю

### В модуле Employers — при отправке кандидата:

Диалог `SubmitCandidatesDialog` — добавить опцию:

```
Что отправить:
  ☑ Резюме (DOCX)
  ☑ Ссылка на портфолио
  ☐ Фото лица
```

При выборе «Ссылка на портфолио» → в сообщение работодателю добавляется публичная ссылка.

### Карточка CandidateSubmission — новое поле:

```
Sent: Resume + Portfolio link
Portfolio: https://site.com/portfolio/abc123xyz  [Open]
```

---

## 6. Бэкенд

### Django-приложение: `backend/apps/portfolio/`

```
backend/apps/portfolio/
├── __init__.py
├── apps.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── tasks.py              # Celery: Instagram download
├── services/
│   ├── __init__.py
│   ├── instagram.py      # Instagram parser (instaloader / API)
│   └── public_link.py    # Генерация / валидация публичных ссылок
├── admin.py
└── migrations/
```

### Модели

```python
import uuid
from django.db import models


class Portfolio(models.Model):
    """Портфолио кандидата — коллекция фото работ."""

    application = models.OneToOneField('applications.Application',
                                        on_delete=models.CASCADE,
                                        related_name="portfolio")
    instagram_url = models.URLField(blank=True)
    instagram_username = models.CharField(max_length=100, blank=True)
    instagram_is_private = models.BooleanField(null=True,
        help_text="True = закрытый, False = открытый, None = не проверяли")
    instagram_last_synced = models.DateTimeField(null=True, blank=True)

    # Публичная ссылка
    public_token = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    public_link_active = models.BooleanField(default=True)
    public_show_name = models.BooleanField(default=False)
    public_show_instagram = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "portfolios"

    def __str__(self):
        return f"Portfolio: {self.application}"

    @property
    def photo_count(self):
        return self.photos.count()

    @property
    def public_url(self):
        from django.conf import settings
        if self.public_link_active:
            return f"{settings.FRONTEND_ORIGIN}/portfolio/{self.public_token}"
        return None


class PortfolioPhoto(models.Model):
    """Одна фотография в портфолио."""

    SOURCE_CHOICES = [
        ("telegram", "Telegram"),
        ("instagram_feed", "Instagram Feed"),
        ("instagram_story", "Instagram Story"),
        ("instagram_reel", "Instagram Reel"),
        ("manual", "Manual Upload"),
    ]

    MEDIA_TYPE_CHOICES = [
        ("image", "Image"),
        ("video", "Video"),
    ]

    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE,
                                   related_name="photos")
    storage_key = models.CharField(max_length=255,
                                    help_text="Ключ в MinIO")
    original_filename = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default="image")
    source_url = models.URLField(blank=True,
                                  help_text="Оригинальный URL (Instagram пост)")
    sort_order = models.IntegerField(default=0,
                                      help_text="Порядок отображения, 0 = первое")
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    file_size_bytes = models.IntegerField(null=True, blank=True)

    uploaded_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL,
                                    null=True, blank=True,
                                    help_text="null = загружено ботом/кандидатом")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "portfolio_photos"
        ordering = ["sort_order", "-created_at"]

    def get_presigned_url(self, expires=3600):
        """Получить presigned URL из MinIO (1 час TTL)."""
        from apps.media_assets.storage import get_presigned_url
        return get_presigned_url(self.storage_key, expires=expires)
```

### API-эндпоинты

```python
# backend/apps/portfolio/urls.py

urlpatterns = [
    # CRUD портфолио (авторизованные)
    path('<int:application_id>/', views.PortfolioDetailView.as_view()),
    path('<int:application_id>/photos/', views.PortfolioPhotoListView.as_view()),
    path('<int:application_id>/photos/upload/', views.PortfolioPhotoUploadView.as_view()),
    path('<int:application_id>/photos/<int:photo_id>/', views.PortfolioPhotoDetailView.as_view()),
    path('<int:application_id>/photos/reorder/', views.PortfolioReorderView.as_view()),

    # Instagram
    path('<int:application_id>/instagram/check/', views.InstagramCheckView.as_view()),
    path('<int:application_id>/instagram/download/', views.InstagramDownloadView.as_view()),

    # Публичная ссылка (управление)
    path('<int:application_id>/public-link/', views.PublicLinkSettingsView.as_view()),
    path('<int:application_id>/public-link/regenerate/', views.RegeneratePublicLinkView.as_view()),

    # Публичная страница (БЕЗ авторизации)
    path('public/<str:token>/', views.PublicPortfolioView.as_view()),
]
```

Регистрация: `path('api/portfolio/', include('apps.portfolio.urls'))`.

**Детали эндпоинтов:**

```
# Портфолио
GET    /api/portfolio/:appId/                 — информация о портфолио (кол-во фото, instagram, public link)
GET    /api/portfolio/:appId/photos/          — список фото с presigned URLs
POST   /api/portfolio/:appId/photos/upload/   — загрузить фото (multipart, до 10 файлов)
DELETE /api/portfolio/:appId/photos/:photoId/ — удалить фото
PUT    /api/portfolio/:appId/photos/reorder/  — изменить порядок [{id, sort_order}, ...]

# Instagram
POST   /api/portfolio/:appId/instagram/check/    — проверить аккаунт (открыт/закрыт)
  body: { "url": "https://instagram.com/username" }
  response: { "username": "nails_by_aigul", "is_private": false, "post_count": 45 }

POST   /api/portfolio/:appId/instagram/download/  — запустить скачивание (Celery task)
  body: { "url": "https://instagram.com/username", "limit": 20 }
  response: { "task_id": "...", "status": "started" }

# Публичная ссылка
GET    /api/portfolio/:appId/public-link/         — текущие настройки
PATCH  /api/portfolio/:appId/public-link/         — обновить (active, show_name, show_instagram)
POST   /api/portfolio/:appId/public-link/regenerate/ — сгенерировать новый токен

# Публичная страница (AllowAny)
GET    /api/portfolio/public/:token/              — данные для публичной страницы
  response: { "position": "Nail Master", "experience_years": 3, "photos": [...urls] }
```

### MinIO: структура хранения

```
recruitment-media/
  portfolio/
    {application_id}/
      {uuid}.jpg          ← фото из Telegram
      {uuid}.jpg          ← фото из Instagram
      {uuid}.jpg          ← загружено рекрутером вручную
```

### Celery Tasks

```python
@shared_task
def download_instagram_portfolio(application_id, instagram_url, limit=20):
    """Скачать фото из открытого Instagram-аккаунта."""
    pass

@shared_task
def check_instagram_privacy(application_id, instagram_url):
    """Проверить открыт ли аккаунт Instagram."""
    pass
```

---

## 7. Telegram-бот: изменения

### В `backend/apps/telegram_bot/orchestration.py`:

Добавить обработку на шаге портфолио:

**Новые inline-кнопки:**
```python
# При запросе портфолио
keyboard = [
    [InlineKeyboardButton("📷 Загрузить фото", callback_data="portfolio_upload")],
    [InlineKeyboardButton("📱 Отправить Instagram", callback_data="portfolio_instagram")],
    [InlineKeyboardButton("⏭ Пропустить", callback_data="portfolio_skip")],
]
```

**Обработка фото:**
- Получение `message.photo` → сохранение в MinIO → создание `PortfolioPhoto(source='telegram')`
- Поддержка `media_group` (альбомы) — группировка по `media_group_id`
- Кнопка «Готово» после загрузки

**Обработка Instagram URL:**
- Валидация URL (regex: `instagram.com/[a-zA-Z0-9_.]+`)
- Запуск `check_instagram_privacy.delay()`
- По результату — сообщение (открыт → скачиваем, закрыт → просим открыть)

---

## 8. Фронтенд

### Новые файлы:

```
frontend/src/pages/portfolio/
├── PortfolioEditorPage.tsx         # /applications/:id/portfolio — редактор
└── PublicPortfolioPage.tsx         # /portfolio/:token — публичная страница

frontend/src/components/portfolio/
├── PortfolioGallery.tsx            # Grid фото с drag & drop reorder
├── PortfolioPhoto.tsx              # Одно фото (превью + действия)
├── PhotoLightbox.tsx               # Полноразмерный просмотр
├── PhotoUploadZone.tsx             # Drag & drop + file input
├── InstagramImportDialog.tsx       # Диалог: ввод URL → проверка → скачивание
├── PublicLinkSettings.tsx          # Настройки публичной ссылки
├── PortfolioSourceBadge.tsx        # Badge: Telegram / Instagram / Manual
└── PortfolioButton.tsx             # Кнопка "Edit Portfolio" для toolbar

frontend/src/lib/
└── portfolio-api.ts
```

### Изменения в существующих файлах:

**`ApplicationDetailPage.tsx`:**
- Добавить кнопку `[🖼 Edit Portfolio]` в toolbar (рядом с Edit Resume)
- Под фото кандидата — мини-превью портфолио (первые 4 фото) + "View all (18)"

**`App.tsx` (роуты):**
```
/applications/:id/portfolio    → PortfolioEditorPage (авторизованный)
/portfolio/:token              → PublicPortfolioPage (публичный, отдельный layout)
```

---

## 9. Приоритеты реализации

### Фаза 1 — MVP (1 неделя)
1. Django app `portfolio/`: модели Portfolio, PortfolioPhoto + миграции
2. API: CRUD фото, upload в MinIO, presigned URLs
3. Telegram-бот: приём фото как портфолио (без Instagram)
4. Дашборд: кнопка "Edit Portfolio", галерея, ручная загрузка, удаление

### Фаза 2 — Instagram (4–5 дней)
1. Instagram-парсер (instaloader)
2. Celery task: check privacy + download
3. Telegram-бот: обработка Instagram URL, проверка приватности
4. Дашборд: InstagramImportDialog

### Фаза 3 — Публичная ссылка (3 дня)
1. Публичная страница `/portfolio/:token`
2. Настройки (что показывать, активация/деактивация)
3. Интеграция с отправкой работодателю (SubmitCandidatesDialog)

### Фаза 4 — Улучшения (2 дня)
1. Drag & drop reorder в галерее
2. Lightbox просмотр
3. Мини-превью в карточке кандидата
4. Фильтр по источнику

---

## 10. Важные правила

1. **MinIO** — все фото хранятся в MinIO (bucket `recruitment-media`), не в файловой системе
2. **Presigned URLs** — TTL 1 час для дашборда, 24 часа для публичной страницы
3. **Публичная ссылка не показывает PII** — никаких имён, телефонов, email
4. **Instagram парсинг** — только открытые аккаунты, никакой авторизации в Instagram (TOS violation)
5. **Rate limiting Instagram** — не чаще 1 запроса в 5 минут на кандидата, Celery task
6. **Любая позиция** — портфолио доступно не только Beauty, но и повара, модели и т.д. Не хардкодить категорию
7. **Без лимитов** — никаких ограничений на количество и размер файлов (ни Telegram, ни Instagram, ни ручная загрузка)
8. **Валидация файлов** — только проверка MIME type (изображения: JPEG, PNG, WebP; видео: MP4, MOV). Без ограничений на размер
9. **Soft delete** — при удалении фото из галереи не удалять сразу из MinIO (пометить как deleted, удалять через 30 дней cron)
10. **Существующие MediaAsset** — фото типа `portfolio` из текущей системы должны автоматически подтянуться при создании Portfolio (миграция данных)
