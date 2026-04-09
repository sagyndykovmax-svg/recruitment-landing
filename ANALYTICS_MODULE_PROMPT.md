# Промпт: Модуль «Analytics / Воронка» для Legacy HR Bot

## Контекст проекта

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание системы — в файле `PROJECT_CONTEXT.md`.

**Стек:** Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO. Фронтенд: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui + react-router.

**Существующие данные в системе (уже есть в базе):**
- **Applications** — заявки кандидатов со статусами (NEW → IN_PROGRESS → COMPLETED → SHORTLISTED → HIRED / REJECTED)
- **Candidates** — персональные данные, AI score, категория (Beauty/Hospitality/Other)
- **Vacancies** — вакансии с категориями и локациями
- **Employers** — работодатели (модуль Employers)
- **EmployerVacancies** — вакансии работодателей
- **CandidateSubmissions** — отправки кандидатов работодателям (sent → interview → hired/rejected)
- **Messages** — все Telegram-сообщения бота
- **MediaAssets** — фото, резюме, портфолио
- **AuditEvents** — лог действий

**Важно:** модуль Analytics НЕ собирает новые данные. Он **агрегирует и визуализирует** то, что уже есть в базе. Никаких новых форм ввода — только чтение, подсчёт и графики.

---

## Задача

Добавить раздел **«Analytics»** в дашборд — страницу с воронками, метриками и графиками, которая отвечает на вопросы:

1. **Сколько?** — кандидатов пришло, обработано, отправлено, нанято
2. **Где теряем?** — на каком этапе воронки отвал
3. **Какой канал лучше?** — откуда приходят лучшие кандидаты
4. **Сколько заработали?** — (когда подключат финансы) unit-экономика
5. **Как быстро?** — среднее время от заявки до найма
6. **Кто эффективнее?** — (при нескольких рекрутерах) результаты по рекрутерам

---

## Sidebar

Новый пункт:

```
📈 Analytics          → /analytics
```

Расположение: первым в sidebar (до Vacancies) — это главная метрика бизнеса.

---

## Страница Analytics (`/analytics`)

### Верхняя панель — фильтры

Одна строка фильтров, применяется ко всей странице:

- **Период**: кнопки `7d` / `30d` / `90d` / `Year` / `All` + кастомный диапазон (DateRangePicker)
- **Категория**: Select `All` / `Beauty` / `Hospitality` / `Other`
- **Страна**: Select `All` / `UAE` / `Saudi Arabia` / `Qatar` / `Kuwait`
- **Источник**: Select `All` / конкретный источник (`heard_about_company` из Candidate)

Фильтры запоминаются в URL-параметрах (можно шарить ссылку).

---

### Секция 1 — Ключевые цифры (KPI Cards)

Горизонтальная сетка из 6 карточек (3x2 на mobile, 6x1 на desktop):

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  📥 248       │ │  ✅ 89        │ │  📤 42        │
│  Новых заявок │ │  Завершённых │ │  Отправлено   │
│  +23% ↑      │ │  +12% ↑      │ │  работодателям│
│              │ │              │ │  +8% ↑       │
└──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  🎉 14        │ │  ⏱ 12 дней   │ │  📊 36%       │
│  Нанято      │ │  Среднее     │ │  Конверсия    │
│  +40% ↑      │ │  время найма │ │  заявка→найм  │
│              │ │  -3 дня ↓    │ │  +5% ↑       │
└──────────────┘ └──────────────┘ └──────────────┘
```

Каждая карточка:
- Число (крупным шрифтом)
- Название метрики (серый текст)
- Изменение vs предыдущий период (зелёный ↑ / красный ↓ / серый →)
- shadcn `Card` компонент

**Формулы:**
| Метрика | Источник данных |
|---------|----------------|
| Новых заявок | `Application.objects.filter(created_at__range=period).count()` |
| Завершённых | `Application.objects.filter(status='COMPLETED', ...).count()` |
| Отправлено работодателям | `CandidateSubmission.objects.filter(sent_at__range=period).count()` |
| Нанято | `CandidateSubmission.objects.filter(employer_response='hired', ...).count()` или `Application.objects.filter(status='HIRED', ...)` |
| Среднее время найма | Среднее `(hired_date - application.created_at)` для нанятых |
| Конверсия заявка→найм | `hired_count / total_applications * 100` |

Изменение: сравнение текущего периода с предыдущим таким же (30d → предыдущие 30d).

---

### Секция 2 — Воронка конверсий (Funnel)

Визуальная воронка — главный элемент страницы.

```
┌─────────────────────────────────────────────────────────┐
│                    ВОРОНКА НАЙМА                         │
│                                                         │
│  ████████████████████████████████████████  248  Заявки   │
│  ██████████████████████████████          182  В работе   │
│  ████████████████████                    89  Завершены   │
│  ████████████                            42  Отправлены  │
│  ████████                                28  Интервью    │
│  █████                                   14  Наняты      │
│                                                         │
│  Конверсия по этапам:                                   │
│  Заявка→В работе: 73%                                   │
│  В работе→Завершён: 49%                                 │
│  Завершён→Отправлен: 47%                                │
│  Отправлен→Интервью: 67%                                │
│  Интервью→Нанят: 50%                                    │
│                                                         │
│  Общая конверсия: 5.6%                                  │
└─────────────────────────────────────────────────────────┘
```

**Этапы воронки (маппинг на данные):**

| Этап воронки | Источник |
|-------------|----------|
| Заявки (Applications) | `Application` со статусом != REJECTED при создании в периоде |
| В работе (In Progress) | Прошли из NEW в IN_PROGRESS |
| Завершены (Completed) | Статус COMPLETED (анкета заполнена на 100%) |
| Отправлены работодателю | Имеют запись в `CandidateSubmission` |
| Интервью | `CandidateSubmission.employer_response = 'interview'` |
| Наняты | `CandidateSubmission.employer_response = 'hired'` или `Application.status = 'HIRED'` |

**Визуализация:**
- Горизонтальные бары (не классический треугольник) — проще читать
- Ширина бара пропорциональна количеству
- Между барами — процент конверсии
- Цвет: градиент от синего (верх) к зелёному (низ)
- Recharts `BarChart` или кастомный компонент

---

### Секция 3 — Графики по времени (Trends)

Две вкладки (shadcn `Tabs`):

**Tab "Заявки":**
- AreaChart: количество новых заявок по дням/неделям/месяцам (в зависимости от периода)
- Линия 1: все заявки
- Линия 2: завершённые
- Линия 3: нанятые
- Tooltip при наведении: дата + точные числа

**Tab "Время обработки":**
- LineChart: среднее время (в днях) от заявки до каждого этапа
  - До завершения анкеты
  - До отправки работодателю
  - До найма
- Показывает тренд: ускоряемся или замедляемся

---

### Секция 4 — Разбивка по категориям (Breakdown)

Три виджета в ряд:

**По категории (Beauty / Hospitality / Other):**
- DonutChart с легендой
- Показывает: сколько заявок + конверсия в найм для каждой категории
- Пример: Beauty 45% заявок, 8% конверсия | Hospitality 48% заявок, 4% конверсия

**По стране:**
- DonutChart: UAE / Saudi Arabia / Qatar / Kuwait
- Количество заявок + наймов по каждой стране

**По источнику (heard_about_company):**
- Horizontal BarChart: Instagram, Telegram, Friends, Website, Other
- Сортировка по количеству
- Для каждого источника: заявки → наняты → конверсия

---

### Секция 5 — Работодатели (Employer Metrics)

Привязана к модулю Employers. Если модуль не установлен — секция не показывается.

**Карточки (3 штуки):**
- Активных работодателей
- Открытых вакансий
- Среднее время закрытия вакансии

**Таблица "Top Employers":**

| Company | Vacancies | Sent | Hired | Hire Rate | Avg Days to Close |
|---------|-----------|------|-------|-----------|-------------------|
| Al Barsha Salon | 5 | 18 | 6 | 33% | 15 |
| Royal Hotel | 3 | 12 | 3 | 25% | 22 |

- Сортировка по Hired desc
- Hire Rate = Hired / Sent
- Клик по компании → переход на `/employers/:id`

---

### Секция 6 — Узкие места (Bottlenecks)

Автоматические предупреждения — система анализирует данные и выводит карточки:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ Низкая конверсия "Завершён → Отправлен" (47%)    │
│  89 завершённых кандидатов, но только 42 отправлены  │
│  работодателям. Возможно, не хватает вакансий или    │
│  рекрутеры не успевают.                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ⚠️ Hospitality: конверсия в найм всего 4%           │
│  Beauty — 8%. Стоит проверить качество кандидатов    │
│  или требования работодателей в Hospitality.         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ✅ Среднее время найма сократилось на 3 дня         │
│  12 дней vs 15 дней в прошлом месяце.               │
└─────────────────────────────────────────────────────┘
```

**Правила генерации (на бэкенде):**
- Конверсия между этапами <40% → предупреждение
- Категория с конверсией в 2+ раза ниже другой → предупреждение
- Среднее время найма выросло >20% → предупреждение
- Вакансии без кандидатов >5 дней → предупреждение
- Позитивные тренды (время сократилось, конверсия выросла) → зелёная карточка

---

## Бэкенд

### Django-приложение: `backend/apps/analytics/`

```
backend/apps/analytics/
├── __init__.py
├── apps.py
├── views.py           # API views (только GET-эндпоинты)
├── serializers.py     # Сериализация агрегированных данных
├── services/
│   ├── __init__.py
│   ├── kpi.py         # Расчёт KPI-карточек
│   ├── funnel.py      # Расчёт воронки
│   ├── trends.py      # Графики по времени
│   ├── breakdown.py   # Разбивка по категориям/странам/источникам
│   ├── employers.py   # Метрики работодателей
│   └── bottlenecks.py # Анализ узких мест
├── urls.py
└── migrations/        # Пустая (нет своих моделей!)
```

**Ключевое:** этот модуль **не создаёт новых таблиц**. Он только читает данные из существующих моделей (Application, Candidate, CandidateSubmission, Employer, EmployerVacancy) и агрегирует через Django ORM (`annotate`, `aggregate`, `Count`, `Avg`, `F`, `Window`).

---

### API-эндпоинты

```python
# backend/apps/analytics/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Все эндпоинты принимают query params: period, category, country, source

    # KPI карточки (6 чисел + изменения)
    path('kpi/', views.KpiView.as_view()),

    # Воронка (этапы + конверсии)
    path('funnel/', views.FunnelView.as_view()),

    # Графики по времени
    path('trends/applications/', views.ApplicationTrendsView.as_view()),
    path('trends/processing-time/', views.ProcessingTimeTrendsView.as_view()),

    # Разбивки
    path('breakdown/category/', views.CategoryBreakdownView.as_view()),
    path('breakdown/country/', views.CountryBreakdownView.as_view()),
    path('breakdown/source/', views.SourceBreakdownView.as_view()),

    # Работодатели
    path('employers/', views.EmployerMetricsView.as_view()),
    path('employers/top/', views.TopEmployersView.as_view()),

    # Узкие места
    path('bottlenecks/', views.BottlenecksView.as_view()),
]
```

Регистрация: `path('api/analytics/', include('apps.analytics.urls'))`.

Все эндпоинты — **только GET**, только `IsAuthenticated`.

---

### Примеры ответов API

**`GET /api/analytics/kpi/?period=30d`**
```json
{
  "applications_total": 248,
  "applications_change": 23.4,
  "completed": 89,
  "completed_change": 12.1,
  "sent_to_employers": 42,
  "sent_change": 8.3,
  "hired": 14,
  "hired_change": 40.0,
  "avg_days_to_hire": 12,
  "avg_days_change": -20.0,
  "conversion_rate": 5.6,
  "conversion_change": 5.1
}
```

**`GET /api/analytics/funnel/?period=30d`**
```json
{
  "stages": [
    {"name": "Applications", "count": 248, "conversion_from_prev": null},
    {"name": "In Progress", "count": 182, "conversion_from_prev": 73.4},
    {"name": "Completed", "count": 89, "conversion_from_prev": 48.9},
    {"name": "Sent to Employer", "count": 42, "conversion_from_prev": 47.2},
    {"name": "Interview", "count": 28, "conversion_from_prev": 66.7},
    {"name": "Hired", "count": 14, "conversion_from_prev": 50.0}
  ],
  "overall_conversion": 5.6
}
```

**`GET /api/analytics/bottlenecks/?period=30d`**
```json
{
  "items": [
    {
      "type": "warning",
      "title": "Низкая конверсия \"Завершён → Отправлен\" (47%)",
      "description": "89 завершённых кандидатов, но только 42 отправлены работодателям."
    },
    {
      "type": "success",
      "title": "Среднее время найма сократилось на 3 дня",
      "description": "12 дней vs 15 дней в прошлом месяце."
    }
  ]
}
```

---

### Кэширование

Аналитические запросы тяжёлые. Использовать **Redis** (уже в проекте):

- Кэш на 15 минут для каждого уникального набора фильтров
- Ключ: `analytics:{endpoint}:{period}:{category}:{country}:{source}`
- Инвалидация: не нужна (данные обновляются не чаще чем раз в час)
- Использовать `django.core.cache` (Redis backend уже настроен)

---

## Фронтенд

### Новые файлы

```
frontend/src/
├── pages/
│   └── AnalyticsPage.tsx          # Главная страница аналитики
│
├── components/analytics/
│   ├── KpiCards.tsx                # 6 карточек с метриками
│   ├── KpiCard.tsx                # Одна карточка (число + изменение)
│   ├── FunnelChart.tsx            # Визуализация воронки
│   ├── ApplicationTrendsChart.tsx # AreaChart заявок по времени
│   ├── ProcessingTimeChart.tsx    # LineChart времени обработки
│   ├── CategoryBreakdown.tsx     # DonutChart по категориям
│   ├── CountryBreakdown.tsx      # DonutChart по странам
│   ├── SourceBreakdown.tsx       # HorizontalBarChart по источникам
│   ├── EmployerMetrics.tsx       # Карточки + таблица работодателей
│   ├── BottleneckCards.tsx       # Карточки узких мест
│   └── PeriodFilter.tsx          # Панель фильтров (период, категория, страна)
│
└── lib/
    └── analytics-api.ts           # API-клиент
```

### Зависимости

Установить **Recharts** (если ещё не установлен):
```
npm install recharts
```

Компоненты Recharts для использования:
- `AreaChart` — тренды заявок
- `LineChart` — время обработки
- `BarChart` — воронка (горизонтальные бары) + источники
- `PieChart` / `Cell` — категории и страны
- `Tooltip`, `Legend`, `ResponsiveContainer`

---

### Роут

Добавить в `App.tsx`:

```
/analytics → AnalyticsPage
```

---

## Приоритеты реализации

### Фаза 1 — MVP (1 неделя)
1. Django app `analytics/`: services + views (только KPI + Funnel)
2. `AnalyticsPage.tsx` с `KpiCards` и `FunnelChart`
3. `PeriodFilter` (7d/30d/90d)
4. `analytics-api.ts`
5. Sidebar: пункт "Analytics"

### Фаза 2 — Графики (3–4 дня)
1. `ApplicationTrendsChart` + `ProcessingTimeChart`
2. `CategoryBreakdown` + `CountryBreakdown` + `SourceBreakdown`
3. Бэкенд: trends + breakdown endpoints
4. Фильтры: категория, страна, источник

### Фаза 3 — Продвинутое (3–4 дня)
1. `EmployerMetrics` + `TopEmployers` таблица
2. `BottleneckCards` (автоматический анализ)
3. Redis-кэширование
4. Период: кастомный DateRangePicker

---

## Важные правила

1. **Нет новых моделей** — только чтение из существующих таблиц через Django ORM
2. **Все расчёты на бэкенде** — фронтенд только отображает готовые числа и массивы точек для графиков
3. **Кэширование в Redis** — аналитика не должна тормозить основную систему
4. **Фильтры в URL** — `?period=30d&category=beauty&country=UAE` (можно шарить ссылку)
5. **Следовать стилю проекта** — shadcn Card, Table, Tabs, Badge; тёмная тема; TypeScript
6. **Recharts** — единственная библиотека для графиков (не Chart.js, не D3)
7. **Graceful degradation** — если модуль Employers не установлен, секция "Employer Metrics" просто не показывается (проверка: если endpoint вернул 404)
8. **Mobile** — карточки KPI в 2 колонки, графики full-width со скроллом
