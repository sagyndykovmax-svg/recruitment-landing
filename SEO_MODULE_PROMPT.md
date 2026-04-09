# Промпт: SEO-модуль для дашборда Recruitment Ops (Legacy HR Bot)

## Контекст проекта

**Legacy HR Bot** — платформа автоматизации рекрутинга. Кандидаты проходят анкетирование через Telegram-бот, рекрутеры управляют заявками через веб-дашборд. Система парсит резюме через GPT-4, синхронизирует с Notion, генерирует Word-резюме.

Публичный сайт — лендинг рекрутингового агентства (работа за границей: ОАЭ, Саудовская Аравия, Катар, Кувейт). Два направления: бьюти-сфера и сфера сервиса.

### Полный стек проекта:

**Backend:**
- Django 6.0 + Django REST Framework
- Celery + Celery Beat (фоновые и периодические задачи)
- PostgreSQL 16
- Redis 7 (кэш + очередь Celery)
- MinIO (S3-совместимое хранилище: фото, резюме, документы)
- OpenAI GPT-4 (AI-функции)
- Notion API (двусторонняя синхронизация)

**Frontend (дашборд рекрутера):**
- React 18 + TypeScript
- Vite (сборка)
- TailwindCSS + shadcn/ui (UI-компоненты)
- API-клиент на fetch (`api.ts` — типы + fetch-обёртки)
- react-router (роутинг)
- Тёмная тема, sidebar навигация (`components/app-sidebar.tsx`)

**Deploy:**
- Docker Compose через Portainer
- Сервисы: postgres, redis, minio, backend, worker, beat, frontend

### Существующие разделы дашборда:
- **Vacancies** (CRUD, категории Beauty/Hospitality/Other, зарплаты, локации)
- **Applications** (таблица заявок с фильтрами, поиском, bulk-действиями)
- **Kanban** (drag-and-drop по статусам)
- **Resume Editor** (редактирование + скачивание DOCX)
- **Candidates** (список кандидатов)
- **Telegram Messages** (лог сообщений)
- **Notion Sync Status** (статус синхронизации)
- **Audit Events** (кто что менял)
- **Settings** (токен бота, ID канала)

### Существующие API-эндпоинты (base: `/api/`):
- `/api/applications/` — CRUD заявок, статусы, Notion sync, резюме
- `/api/vacancies/` — CRUD вакансий, публикация в Telegram
- `/api/candidates/` — кандидаты
- `/api/messages/` — Telegram-сообщения
- `/api/media/` — медиа-файлы (MinIO)
- `/api/audit-events/` — аудит-лог
- `/api/telegram-settings/` — настройки бота
- `/api/login/`, `/api/me/` — авторизация

### Структура бэкенда:
```
backend/apps/
├── ai_orchestration/    # AI: chains, extraction, merge
├── candidates/          # Candidate model
├── applications/        # Application model + services
├── telegram_bot/        # Bot orchestration + services
├── media_assets/        # Фото, резюме, MinIO storage
├── recruiters/          # API для дашборда (views, serializers, resume gen)
├── notion_sync/         # Notion API sync (services + Celery tasks)
├── messaging/           # Message model
├── vacancies/           # Vacancy model
└── audit/               # Audit events
```

### Структура фронтенда:
```
frontend/src/
├── App.tsx              # Роутинг (react-router)
├── api.ts               # Типы + API-клиент (fetch-обёртки)
├── pages/               # Страницы дашборда
│   ├── ApplicationsPage.tsx
│   ├── ApplicationDetailPage.tsx
│   ├── KanbanPage.tsx
│   ├── VacanciesPage.tsx
│   └── ...
└── components/
    └── app-sidebar.tsx  # Sidebar навигация
```

---

## Задача

Добавить **SEO-модуль** в существующую платформу Legacy HR Bot:
1. **Бэкенд:** новое Django-приложение `backend/apps/seo/` с моделями, views, serializers, Celery tasks
2. **Фронтенд:** новые страницы и компоненты в существующем дашборде (новый пункт "SEO" в sidebar)
3. **Интеграции:** Google Search Console, PageSpeed API, SerpAPI — через Celery tasks

---

## 1. Бэкенд: Django-приложение `seo`

### Создать: `backend/apps/seo/`

```
backend/apps/seo/
├── __init__.py
├── apps.py
├── models.py          # Django-модели (SeoPage, Keyword, Position, AuditLog, Report, etc.)
├── serializers.py     # DRF serializers
├── views.py           # DRF ViewSets
├── urls.py            # URL-паттерны (/api/seo/...)
├── tasks.py           # Celery tasks (position tracking, audit, reports)
├── services/
│   ├── __init__.py
│   ├── serp.py        # SerpAPI / DataForSEO клиент
│   ├── pagespeed.py   # Google PageSpeed Insights API
│   ├── search_console.py  # Google Search Console API
│   ├── broken_links.py    # Сканер битых ссылок
│   ├── report_generator.py # Генерация отчётов
│   └── sitemap.py     # Генерация sitemap.xml
├── admin.py           # Django admin (для отладки)
└── migrations/
```

**Зарегистрировать:** добавить `'apps.seo'` в `INSTALLED_APPS` и `path('api/seo/', include('apps.seo.urls'))` в корневой `urls.py`.

---

### Django-модели (`models.py`)

```python
from django.db import models


class SeoPage(models.Model):
    """SEO-метаданные для каждой страницы публичного сайта."""
    slug = models.SlugField(max_length=255, unique=True)
    page_title = models.CharField(max_length=255, blank=True)
    meta_title = models.CharField(max_length=70, blank=True,
                                  help_text="Рекомендуется 30–60 символов")
    meta_description = models.CharField(max_length=170, blank=True,
                                        help_text="Рекомендуется 120–160 символов")
    canonical_url = models.URLField(blank=True)
    robots = models.CharField(max_length=50, default="index, follow")

    # Open Graph
    og_title = models.CharField(max_length=100, blank=True)
    og_description = models.CharField(max_length=200, blank=True)
    og_image = models.URLField(blank=True)

    # Structured data
    json_ld = models.JSONField(default=dict, blank=True,
                               help_text="JSON-LD микроразметка")

    # Auto-calculated
    seo_score = models.IntegerField(default=0, help_text="0–100, автоматически")
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seo_pages"
        ordering = ["slug"]

    def __str__(self):
        return self.slug


class Keyword(models.Model):
    """Ключевое слово из семантического ядра."""

    CATEGORY_CHOICES = [
        ("beauty", "Beauty"),
        ("hospitality", "Hospitality"),
        ("location", "Location"),
        ("general", "General"),
    ]

    word = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES,
                                blank=True)
    group = models.CharField(max_length=100, blank=True,
                             help_text="Подгруппа внутри категории")
    volume = models.IntegerField(null=True, blank=True,
                                 help_text="Среднемесячный объём запросов")
    competition = models.FloatField(null=True, blank=True,
                                    help_text="0–1, уровень конкуренции")
    trend = models.JSONField(default=list, blank=True,
                             help_text='[{"month":"2024-01","value":1200}, ...]')
    page = models.ForeignKey(SeoPage, on_delete=models.SET_NULL,
                             null=True, blank=True, related_name="keywords")
    location = models.CharField(max_length=10, blank=True,
                                help_text="Целевая локация: UAE, SA, QA, KW")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seo_keywords"
        ordering = ["-volume"]

    def __str__(self):
        return self.word


class Position(models.Model):
    """Снимок позиции ключевого слова в Google."""
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE,
                                related_name="positions")
    position = models.IntegerField()
    url = models.URLField(blank=True, help_text="URL в выдаче")
    location = models.CharField(max_length=10, blank=True)
    checked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "seo_positions"
        ordering = ["-checked_at"]
        indexes = [
            models.Index(fields=["keyword", "checked_at"]),
            models.Index(fields=["checked_at"]),
        ]


class AuditLog(models.Model):
    """Результаты технических проверок."""

    TYPE_CHOICES = [
        ("broken_link", "Broken Link"),
        ("pagespeed", "PageSpeed"),
        ("health", "Health Check"),
        ("indexation", "Indexation"),
    ]
    STATUS_CHOICES = [
        ("ok", "OK"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "seo_audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["type", "created_at"]),
        ]


class Report(models.Model):
    """Ежемесячный SEO-отчёт."""
    report_month = models.DateField(unique=True)
    traffic = models.JSONField(default=dict,
                               help_text='{"organic":1200,"clicks":800,...}')
    positions = models.JSONField(default=dict,
                                 help_text='{"top3":5,"top10":15,"avg":12.5}')
    health = models.JSONField(default=dict,
                              help_text='{"score":85,"errors":2,"warnings":5}')
    actions = models.JSONField(default=list,
                               help_text="Список действий за месяц")
    recommendations = models.JSONField(default=list)
    pdf_storage_key = models.CharField(max_length=255, blank=True,
                                       help_text="Ключ в MinIO для PDF")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "seo_reports"
        ordering = ["-report_month"]


class SeoSetting(models.Model):
    """Настройки SEO-модуля (key-value)."""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seo_settings"

    # Примеры ключей:
    # "site_domain" → "globalstaff.com"
    # "serp_api_key" → "..."
    # "pagespeed_api_key" → "..."
    # "gsc_credentials_json" → "{...}"
    # "ga4_measurement_id" → "G-XXXXXXX"
    # "robots_txt" → "User-agent: *\nAllow: /"


class Competitor(models.Model):
    """Домен конкурента для сравнения позиций."""
    domain = models.CharField(max_length=255)
    name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "seo_competitors"


class CronTask(models.Model):
    """Статус и расписание периодических SEO-задач."""
    task_name = models.CharField(max_length=100, unique=True)
    schedule = models.CharField(max_length=50, help_text="Описание расписания")
    is_enabled = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    last_status = models.CharField(max_length=20, blank=True)  # success/warning/error
    last_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "seo_cron_tasks"
```

---

### Celery Tasks (`tasks.py`)

Добавить в существующую Celery-конфигурацию (Celery Beat):

```python
from celery import shared_task

@shared_task
def track_positions():
    """Еженедельный съём позиций по всем ключевым словам через SerpAPI."""
    pass

@shared_task
def scan_broken_links():
    """Еженедельная проверка битых ссылок на сайте."""
    pass

@shared_task
def run_pagespeed_audit():
    """Еженедельный аудит скорости через PageSpeed Insights API."""
    pass

@shared_task
def run_health_check():
    """Проверка доступности сайта, SSL, редиректов (3 раза в неделю)."""
    pass

@shared_task
def refresh_keyword_volumes():
    """Раз в 3 месяца: пересбор объёмов и трендов ключевых слов."""
    pass

@shared_task
def generate_monthly_report():
    """1-е число месяца: генерация SEO-отчёта."""
    pass

@shared_task
def ping_sitemap():
    """При изменении контента: пинг Google о новом sitemap."""
    pass
```

**Расписание (добавить в Celery Beat schedule):**

```python
CELERY_BEAT_SCHEDULE = {
    # ... существующие задачи (Notion sync и т.д.)

    'seo-track-positions': {
        'task': 'apps.seo.tasks.track_positions',
        'schedule': crontab(hour=3, minute=0, day_of_week=1),  # Пн 03:00
    },
    'seo-broken-links': {
        'task': 'apps.seo.tasks.scan_broken_links',
        'schedule': crontab(hour=3, minute=0, day_of_week=3),  # Ср 03:00
    },
    'seo-pagespeed': {
        'task': 'apps.seo.tasks.run_pagespeed_audit',
        'schedule': crontab(hour=3, minute=0, day_of_week=5),  # Пт 03:00
    },
    'seo-health-check': {
        'task': 'apps.seo.tasks.run_health_check',
        'schedule': crontab(hour=6, minute=0, day_of_week='1,3,5'),  # Пн/Ср/Пт 06:00
    },
    'seo-keyword-refresh': {
        'task': 'apps.seo.tasks.refresh_keyword_volumes',
        'schedule': crontab(hour=4, minute=0, day_of_month=1, month_of_year='1,4,7,10'),  # Квартально
    },
    'seo-monthly-report': {
        'task': 'apps.seo.tasks.generate_monthly_report',
        'schedule': crontab(hour=5, minute=0, day_of_month=1),  # 1-е число месяца
    },
}
```

---

### DRF API-эндпоинты (`urls.py`)

```python
# backend/apps/seo/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('pages', views.SeoPageViewSet, basename='seo-page')
router.register('keywords', views.KeywordViewSet, basename='seo-keyword')
router.register('reports', views.ReportViewSet, basename='seo-report')
router.register('competitors', views.CompetitorViewSet, basename='seo-competitor')

urlpatterns = [
    path('', include(router.urls)),

    # Overview
    path('overview/', views.SeoOverviewView.as_view()),

    # Positions
    path('positions/', views.PositionListView.as_view()),
    path('positions/history/<int:keyword_id>/', views.PositionHistoryView.as_view()),
    path('positions/track/', views.TriggerPositionTrackingView.as_view()),

    # Audit
    path('audit/latest/', views.LatestAuditView.as_view()),
    path('audit/history/', views.AuditHistoryView.as_view()),
    path('audit/run/', views.TriggerAuditView.as_view()),
    path('audit/pagespeed/', views.PageSpeedResultView.as_view()),
    path('audit/broken-links/', views.BrokenLinksView.as_view()),

    # Keywords bulk
    path('keywords/import/', views.KeywordImportView.as_view()),
    path('keywords/refresh/', views.TriggerKeywordRefreshView.as_view()),

    # Reports
    path('reports/generate/', views.TriggerReportGenerationView.as_view()),
    path('reports/<int:pk>/pdf/', views.ReportPDFView.as_view()),

    # Settings
    path('settings/', views.SeoSettingsView.as_view()),
    path('settings/cron/', views.CronTaskListView.as_view()),
    path('settings/cron/<int:pk>/run/', views.TriggerCronTaskView.as_view()),
]
```

**Все эндпоинты требуют авторизации** — использовать тот же `IsAuthenticated` permission, что и в `apps.recruiters.views`.

---

## 2. Фронтенд: новые страницы в дашборде

### Новый пункт в sidebar (`app-sidebar.tsx`)

Добавить между существующими пунктами:

```
📊 SEO
  ├── Overview        → /seo
  ├── Pages           → /seo/pages
  ├── Keywords        → /seo/keywords
  ├── Positions       → /seo/positions
  ├── Technical Audit → /seo/audit
  ├── Reports         → /seo/reports
  └── SEO Settings    → /seo/settings
```

### Новые файлы

```
frontend/src/
├── pages/seo/
│   ├── SeoOverview.tsx          # Сводка: виджеты, графики, топ-10 keywords
│   ├── SeoPages.tsx             # Таблица страниц с SEO-данными
│   ├── SeoPageEdit.tsx          # Редактирование meta, OG, SERP preview
│   ├── SeoKeywords.tsx          # Семантическое ядро: таблица, фильтры
│   ├── SeoKeywordDetail.tsx     # Детали keyword: графики, тренды
│   ├── SeoPositions.tsx         # Трекинг позиций: line chart, таблица
│   ├── SeoAudit.tsx             # Здоровье сайта: score, broken links, PageSpeed
│   ├── SeoReports.tsx           # Список отчётов
│   ├── SeoReportDetail.tsx      # Детали отчёта: графики, рекомендации
│   └── SeoSettings.tsx          # API-ключи, robots.txt, cron, конкуренты
│
├── components/seo/
│   ├── SerpPreview.tsx          # Предпросмотр Google-сниппета
│   ├── SeoScoreIndicator.tsx    # Круговой индикатор 0–100
│   ├── PositionChart.tsx        # Line chart позиций (Recharts)
│   ├── TrafficChart.tsx         # Line chart трафика
│   ├── PositionDistribution.tsx # Donut chart: top-3/10/20/20+
│   ├── KeywordSparkline.tsx     # Мини-график тренда в таблице
│   ├── HealthScore.tsx          # Большой индикатор здоровья сайта
│   ├── CoreWebVitals.tsx        # LCP/FID/CLS виджеты
│   ├── SeoChecklist.tsx         # Чеклист оптимизации страницы
│   ├── CompetitorComparison.tsx # Сравнение позиций с конкурентами
│   └── IntegrationPlaceholder.tsx # Заглушка "API не настроен"
│
└── lib/
    └── seo-api.ts               # SEO API-клиент (расширяет паттерн api.ts)
```

### API-клиент (`seo-api.ts`)

Следовать паттерну существующего `api.ts` — типы + fetch-обёртки:

```typescript
// Типы
export interface SeoPage {
  id: number;
  slug: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  robots: string;
  og_title: string;
  og_description: string;
  og_image: string;
  json_ld: Record<string, unknown>;
  seo_score: number;
  is_published: boolean;
  keywords: Keyword[];
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: number;
  word: string;
  category: string;
  group: string;
  volume: number | null;
  competition: number | null;
  trend: Array<{ month: string; value: number }>;
  page: number | null;
  location: string;
  latest_position?: number;
}

export interface PositionSnapshot {
  id: number;
  keyword_id: number;
  position: number;
  url: string;
  location: string;
  checked_at: string;
}

// ... (AuditLog, Report, SeoSetting, Competitor, CronTask types)

// API functions (использовать тот же fetch-паттерн что в api.ts)
export const seoApi = {
  // Overview
  getOverview: () => fetchApi('/api/seo/overview/'),

  // Pages
  getPages: () => fetchApi('/api/seo/pages/'),
  getPage: (id: number) => fetchApi(`/api/seo/pages/${id}/`),
  updatePage: (id: number, data: Partial<SeoPage>) =>
    fetchApi(`/api/seo/pages/${id}/`, { method: 'PATCH', body: data }),

  // Keywords
  getKeywords: (params?: Record<string, string>) =>
    fetchApi('/api/seo/keywords/', { params }),
  createKeyword: (data: Partial<Keyword>) =>
    fetchApi('/api/seo/keywords/', { method: 'POST', body: data }),
  importKeywords: (file: File) => uploadFile('/api/seo/keywords/import/', file),
  refreshKeywords: () =>
    fetchApi('/api/seo/keywords/refresh/', { method: 'POST' }),

  // Positions
  getPositions: (params?: Record<string, string>) =>
    fetchApi('/api/seo/positions/', { params }),
  getPositionHistory: (keywordId: number) =>
    fetchApi(`/api/seo/positions/history/${keywordId}/`),
  triggerTracking: () =>
    fetchApi('/api/seo/positions/track/', { method: 'POST' }),

  // Audit
  getLatestAudit: () => fetchApi('/api/seo/audit/latest/'),
  getAuditHistory: () => fetchApi('/api/seo/audit/history/'),
  runAudit: () => fetchApi('/api/seo/audit/run/', { method: 'POST' }),

  // Reports
  getReports: () => fetchApi('/api/seo/reports/'),
  getReport: (id: number) => fetchApi(`/api/seo/reports/${id}/`),
  generateReport: () =>
    fetchApi('/api/seo/reports/generate/', { method: 'POST' }),
  downloadPdf: (id: number) =>
    fetchBlob(`/api/seo/reports/${id}/pdf/`),

  // Settings
  getSettings: () => fetchApi('/api/seo/settings/'),
  updateSettings: (data: Record<string, string>) =>
    fetchApi('/api/seo/settings/', { method: 'PUT', body: data }),
  getCronTasks: () => fetchApi('/api/seo/settings/cron/'),
  triggerCronTask: (taskId: number) =>
    fetchApi(`/api/seo/settings/cron/${taskId}/run/`, { method: 'POST' }),
};
```

---

## 3. Описание каждой страницы дашборда

### 3.1. SEO Overview (`/seo`)

**Виджеты-карточки (shadcn Card, сетка 2x2 на desktop):**
- Органический трафик за месяц (из Google Search Console)
- Средняя позиция по ключевым словам
- Проиндексировано страниц
- Health Score (0–100)

**Графики (Recharts, устанавливается как npm-зависимость):**
- Трафик за 6 месяцев (AreaChart)
- Распределение позиций: top-3 / top-10 / top-20 / 20+ (PieChart)
- Core Web Vitals (BarChart)

**Таблица (shadcn DataTable):**
- Топ-10 ключевых слов: word, position, change (↑↓), volume, page

**Лента событий:**
- Последние 5 аудит-событий (Badge со статусом)

**Заглушка при отсутствии данных:**
- Если API не настроены → компонент `IntegrationPlaceholder` с кнопкой "Go to Settings"

---

### 3.2. Pages (`/seo/pages`)

**Таблица страниц:**

| Slug | Meta Title | Meta Desc | SEO Score | Published | Actions |
|------|-----------|-----------|-----------|-----------|---------|

- SEO Score: цветной Badge (зелёный 80+, жёлтый 50–79, красный <50)
- Actions: Edit кнопка

**Страница редактирования (`/seo/pages/:id`):**

Форма в 2 колонки:
- **Левая:** Meta Title (с счётчиком символов 0/60), Meta Description (0/160), Canonical URL, Robots (Select), JSON-LD (code editor)
- **Правая:** OG Title, OG Description, OG Image URL, Twitter Card type

**Под формой:**
- **SERP Preview** — компонент `SerpPreview.tsx` показывающий как сниппет выглядит в Google (синий заголовок, зелёный URL, серое описание)
- **SEO Checklist** — автоматический чеклист (shadcn Checkbox):
  - ✅ Meta title 30–60 символов
  - ✅ Meta description 120–160 символов
  - ✅ Canonical URL задан
  - ⚠️ OG image не задан
  - и т.д.

---

### 3.3. Keywords (`/seo/keywords`)

**Toolbar:**
- Button "Add Keyword" → Dialog
- Button "Import CSV" → file upload
- Button "Refresh Data" → вызов `/api/seo/keywords/refresh/` (Celery task)
- Фильтры: category (Select), group (Select), position range (1–3, 4–10, 11–20, 20+)

**Таблица:**

| Keyword | Category | Volume | Competition | Position | Page | Trend |
|---------|----------|--------|-------------|----------|------|-------|

- Competition: Badge (Low зелёный, Medium жёлтый, High красный)
- Position: цветной текст (1–3 зелёный, 4–10 жёлтый, 11–20 оранжевый, 20+ красный, "—" серый)
- Trend: `KeywordSparkline` — мини line chart (50x20px) за 12 месяцев

**Клик по keyword → `/seo/keywords/:id`:**
- Graph: позиция по времени (LineChart)
- Graph: объём запросов за 48 месяцев (AreaChart)
- Привязанная страница (ссылка)

---

### 3.4. Positions (`/seo/positions`)

**Фильтры:**
- Период: 7d / 30d / 90d / All (кнопки)
- Location: UAE / SA / QA / KW / All (Select)
- Category (Select)
- Page (Select)

**LineChart** — позиции выбранных keywords (до 5) по времени. Чекбоксы для выбора keywords.

**Таблица:**

| Keyword | Today | 7d Change | 30d Change | Best | Page |
|---------|-------|-----------|------------|------|------|

- Change: ↑3 зелёный, ↓2 красный, → серый

---

### 3.5. Technical Audit (`/seo/audit`)

**Health Score:** большой круговой индикатор (компонент `HealthScore.tsx`), цвет по значению.

**Tabs (shadcn Tabs):**

**Tab "Broken Links":**
- Таблица: URL, Status Code, Found On, Last Checked
- Button "Scan Now"

**Tab "PageSpeed":**
- Desktop Score / Mobile Score (2 карточки)
- Core Web Vitals: LCP, FID, CLS — каждый с индикатором Good/Needs Improvement/Poor
- Button "Re-test"

**Tab "Audit Log":**
- Таблица всех проверок: Type, Status, Message, Date
- Фильтр по type

---

### 3.6. Reports (`/seo/reports`)

**Таблица:**

| Month | Traffic | Avg Position | Health | Top-10 Keywords | Actions |
|-------|---------|-------------|--------|-----------------|---------|

- Actions: View, Download PDF

**Button** "Generate Now" → `POST /api/seo/reports/generate/`

**Детали отчёта (`/seo/reports/:id`):**
- Секция "Traffic": AreaChart + цифры
- Секция "Positions": распределение + динамика
- Секция "Health": score + ошибки
- Секция "Recommendations": список рекомендаций

---

### 3.7. SEO Settings (`/seo/settings`)

**Tabs:**

**Tab "General":**
- Site domain (Input)
- WhatsApp number (Input)
- Telegram username (Input)

**Tab "API Keys":**
- SerpAPI Key (Input + статус ✅/❌)
- PageSpeed API Key (Input + статус)
- Google Search Console (JSON textarea + статус)
- Google Analytics Measurement ID (Input + статус)
- Ahrefs API Key (Input + статус, помечен "Optional")

**Tab "Competitors":**
- Таблица доменов (domain, name) + кнопки Add/Delete

**Tab "Robots.txt":**
- Textarea с содержимым robots.txt
- Button "Save & Deploy"

**Tab "Scheduled Tasks":**
- Таблица:

| Task | Schedule | Last Run | Status | Enabled | Actions |
|------|----------|----------|--------|---------|---------|

- Enabled: Switch (shadcn)
- Actions: Button "Run Now"

---

## 4. Интеграции

| Сервис | Зачем | Celery task | Приоритет |
|--------|-------|-------------|-----------|
| SerpAPI / DataForSEO | Позиции, объёмы keywords | `track_positions`, `refresh_keyword_volumes` | Фаза 1 |
| Google PageSpeed | Скорость, Core Web Vitals | `run_pagespeed_audit` | Фаза 1 (бесплатный) |
| Google Search Console | Трафик, клики, показы | overview data | Фаза 2 |
| Google Analytics 4 | Детальный трафик | overview data | Фаза 2 |
| Ahrefs | Бэклинки, DR | конкурентный анализ | Фаза 3 (опционально) |

**Правило graceful degradation:** если API-ключ не задан в `SeoSetting` → виджет показывает `IntegrationPlaceholder` (не ломается, не кидает ошибку).

---

## 5. Telegram-уведомления

Использовать существующую интеграцию с Telegram-ботом (`apps.telegram_bot`) для отправки SEO-алертов:

- **Падение позиций:** ключевое слово упало из top-10 → сообщение в чат рекрутера
- **Ошибки аудита:** critical error при проверке здоровья → alert
- **Отчёт готов:** ежемесячный отчёт сгенерирован → ссылка в Telegram

Реализовать через Celery task → вызов `bot.send_message()` из существующего бота.

---

## 6. Хранение PDF-отчётов

Использовать существующий **MinIO** (bucket `recruitment-media`):
- Ключ: `seo-reports/{year}/{month}/report-{YYYY-MM}.pdf`
- Presigned URL для скачивания (как у резюме — 7 дней TTL)

---

## 7. Приоритеты реализации

### Фаза 1 — MVP (2 недели)
1. Django app `seo/`: модели + миграции
2. DRF ViewSets для Pages и Keywords
3. Фронтенд: роуты `/seo/*`, sidebar, SeoPages, SeoKeywords
4. SERP Preview компонент
5. SEO Checklist
6. `seo-api.ts`

### Фаза 2 — Трекинг (недели 3–4)
1. SerpAPI интеграция → `track_positions` Celery task
2. Positions page с графиками (Recharts)
3. PageSpeed API интеграция → `run_pagespeed_audit`
4. Technical Audit page
5. Broken links scanner
6. Celery Beat schedule

### Фаза 3 — Аналитика (месяц 2)
1. Google Search Console интеграция
2. Google Analytics интеграция
3. SEO Overview с реальными данными
4. Report generation → MinIO PDF
5. Telegram-алерты через существующий бот

### Фаза 4 — Продвинутое (месяц 3+)
1. Конкурентный анализ (Ahrefs / SerpAPI)
2. Контент-гэп анализ
3. Рекомендательная система
4. Квартальное обновление данных
5. Экспорт отчётов в Notion

---

## 8. Важные правила

1. **Не трогать существующий код** — только добавлять. Новый Django app, новые фронтенд-файлы
2. **Следовать стилю проекта:**
   - Бэкенд: смотреть `apps/recruiters/views.py`, `serializers.py` → делать SEO так же
   - Фронтенд: смотреть `pages/VacanciesPage.tsx`, `pages/ApplicationsPage.tsx` → копировать паттерны
   - Компоненты: shadcn/ui (Button, Card, Table, Input, Select, Sheet, Dialog, Tabs, Badge, Switch, Toast)
3. **TypeScript** — строгая типизация, интерфейсы
4. **Тёмная тема** — все компоненты должны работать в dark mode (shadcn поддерживает из коробки)
5. **API-паттерн** — расширять `api.ts` или создать `seo-api.ts` в том же стиле
6. **Celery** — задачи в `apps/seo/tasks.py`, расписание в настройках Celery Beat
7. **MinIO** — для PDF-отчётов, использовать существующий `apps.media_assets.storage`
8. **Docker** — SEO-модуль не требует новых Docker-сервисов (всё работает в существующих backend/worker/beat)
