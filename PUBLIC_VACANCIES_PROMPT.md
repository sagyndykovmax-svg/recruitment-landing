# Промпт: Модуль «Публичная витрина вакансий» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL + MinIO. Фронтенд: React 18 + TS + shadcn/ui.

Сейчас лендинг общий — без конкретных вакансий. Кандидат видит "Работа за границей" и нажимает "Оставить заявку". Но не видит конкретных позиций с зарплатами. Также Telegram-бот принимает `/start` с параметром вакансии, но кандидат должен сам найти ссылку.

Нужна публичная страница со списком вакансий → кандидат выбирает → попадает в бот с привязкой.

---

## Задача

Добавить **публичную витрину вакансий** — страницы, доступные без авторизации, которые показывают открытые вакансии и ведут кандидата в Telegram-бот.

---

## 1. Публичные страницы (без авторизации)

### Страница списка вакансий (`/jobs`)

**URL:** `https://site.com/jobs`

**Дизайн:** светлая тема, mobile-first, стиль лендинга (не дашборда).

**Header:**
```
Legacy — Вакансии за рубежом
[Все]  [Beauty]  [Hospitality]
Страна: [All ▼]  Поиск: [🔍 ...]
```

**Карточки вакансий (grid: 1 колонка mobile, 2 tablet, 3 desktop):**

```
┌─────────────────────────────────────────┐
│  💅 Nail Master                          │
│  🏢 Премиальный салон, Дубай             │
│                                         │
│  💰 $2,000–2,500/мес                     │
│  📍 ОАЭ, Дубай                           │
│  🏠 Жильё предоставляется               │
│  📅 Контракт: 1 год                      │
│                                         │
│  Требования:                            │
│  • Опыт от 2 лет • Портфолио            │
│                                         │
│  [Подробнее]  [📱 Откликнуться]          │
└─────────────────────────────────────────┘
```

- **"Откликнуться"** → ссылка `https://t.me/BOT_USERNAME?start=vacancy_SLUG`
- **"Подробнее"** → открывает детальную страницу `/jobs/:slug`
- Название компании: показывать общее описание ("Премиальный салон"), НЕ точное название (до найма)
- Если вакансий нет → "Новые вакансии появятся скоро. Оставьте заявку, и мы свяжемся."

---

### Детальная страница вакансии (`/jobs/:slug`)

```
← Все вакансии

💅 Nail Master — Дубай, ОАЭ

Зарплата: $2,000–2,500/мес (USD)
График: 6/1, 8 часов
Жильё: предоставляется (отдельная комната)
Питание: включено
Контракт: 1 год
Мест осталось: 2

─────────────────────────────────

Обязанности:
• Маникюр, педикюр, наращивание ногтей
• Работа с премиальной клиентурой

Требования:
• Опыт от 2 лет
• Портфолио работ
• Базовый английский

Мы предоставляем:
• Рабочая виза и страховка
• Перелёт за счёт работодателя
• Проживание в комфортных условиях
• Сопровождение на всех этапах

─────────────────────────────────

[📱 Откликнуться через Telegram]
[📞 Написать в WhatsApp]

─────────────────────────────────

Как это работает:
1. Нажмите "Откликнуться"
2. Ответьте на вопросы бота (5 минут)
3. Мы подберём вакансию и свяжемся
```

**SEO:** каждая страница вакансии имеет:
- `<title>`: "Nail Master в Дубае — работа за границей | Legacy"
- `<meta description>`: из описания вакансии
- JSON-LD `JobPosting` микроразметка
- Open Graph теги

---

## 2. Управление в дашборде

### В существующей VacanciesPage добавить:

**Новые поля вакансии:**
- `is_public` (Boolean) — показывать на витрине
- `public_title` — заголовок для публичной страницы (может отличаться от внутреннего)
- `public_company_description` — "Премиальный салон" вместо реального названия
- `public_description` — расширенное описание для публичной страницы
- `public_requirements` — требования (текст)
- `public_benefits` — что предоставляем (текст)

**Тогл в карточке вакансии:**
```
Публикация:
  🔘 Показывать на сайте (is_public)
  📋 Публичная ссылка: https://site.com/jobs/nail-master  [Copy]
  📱 Telegram-ссылка: https://t.me/bot?start=nail-master  [Copy]
```

**Также:** в EmployerVacancy — кнопка **"Опубликовать на сайте"** → создаёт/обновляет публичную вакансию на основе данных работодателя.

---

## 3. Бэкенд

### Изменения в `backend/apps/vacancies/`

**Новые поля в модели Vacancy:**
```python
# Добавить к существующей модели Vacancy:
is_public = models.BooleanField(default=False)
public_title = models.CharField(max_length=255, blank=True)
public_company_description = models.CharField(max_length=255, blank=True,
    help_text="Общее описание компании (без имени)")
public_description = models.TextField(blank=True)
public_requirements = models.TextField(blank=True)
public_benefits = models.TextField(blank=True)
spots_available = models.IntegerField(default=1)
```

**Публичные API (без авторизации):**
```
GET /api/public/vacancies/              — список публичных вакансий (is_public=True)
GET /api/public/vacancies/:slug/        — детали публичной вакансии
```

Отдаёт только публичные поля. НЕ отдаёт: employer name, internal notes, application counts.

**Фильтры:** `?category=beauty&country=UAE&search=nail`

---

## 4. Фронтенд

### Публичные страницы (отдельный layout, без sidebar, светлая тема):

```
frontend/src/pages/public/
├── PublicVacanciesPage.tsx      # /jobs — список вакансий
└── PublicVacancyDetailPage.tsx  # /jobs/:slug — детали

frontend/src/components/public/
├── PublicHeader.tsx             # Шапка (лого + навигация)
├── PublicFooter.tsx             # Подвал
├── VacancyCard.tsx              # Карточка в списке
├── VacancyFilters.tsx           # Фильтры (категория, страна, поиск)
└── JobPostingJsonLd.tsx         # JSON-LD микроразметка
```

### В дашборде (изменения):

- `VacanciesPage.tsx` → добавить колонку "Public" (иконка глаза)
- Форма вакансии → новый таб "Public Listing" с полями is_public, public_title и т.д.

---

## 5. JSON-LD JobPosting (для Google Jobs)

Каждая публичная вакансия генерирует:

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Nail Master",
  "description": "...",
  "datePosted": "2026-03-28",
  "validThrough": "2026-06-28",
  "employmentType": "FULL_TIME",
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 2000,
      "maxValue": 2500,
      "unitText": "MONTH"
    }
  },
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Legacy"
  }
}
```

---

## Приоритеты

### Фаза 1 (1 неделя): Новые поля Vacancy, публичный API, PublicVacanciesPage, VacancyDetailPage
### Фаза 2 (3 дня): Фильтры, поиск, JSON-LD, OG-теги, SEO
### Фаза 3 (2 дня): Связка с EmployerVacancy ("Опубликовать на сайте"), тогл в дашборде

---

## Важные правила

1. **Публичные страницы — отдельный layout** (светлая тема, PublicHeader/Footer), НЕ дашборд
2. **Не показывать название работодателя** на публичной странице (только общее описание)
3. **Все ссылки "Откликнуться"** → ведут в Telegram-бот с параметром вакансии
4. **Mobile-first** — 80%+ трафика с телефона
5. **SSR-ready** — страницы должны рендериться на сервере для SEO (когда переведёте на Next.js, структура компонентов останется)
