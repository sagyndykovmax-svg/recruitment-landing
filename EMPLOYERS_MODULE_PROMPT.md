# Промпт: Модуль «Работодатели» (Employers) для Legacy HR Bot

## Контекст проекта

**Legacy HR Bot** — платформа автоматизации рекрутинга. Кандидаты проходят анкетирование через Telegram-бот, рекрутеры управляют заявками через веб-дашборд (React 18 + TypeScript + shadcn/ui). Бэкенд — Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO. Деплой — Docker Compose.

Подробное описание всей системы — в файле `PROJECT_CONTEXT.md`.

---

## Задача

Добавить модуль **«Работодатели» (Employers)** в существующую платформу — Фаза 4 HR-платформы.

Модуль включает:
1. **Публичная форма** — работодатель оставляет заявку и описывает вакансию
2. **Раздел в дашборде** — рекрутер управляет работодателями, их вакансиями и подбором кандидатов
3. **Связка** вакансий работодателей с существующими кандидатами из системы
4. **Уведомления** — через существующий Telegram-бот

---

## 1. Публичная форма работодателя

### Точки входа:
- Прямая ссылка (например `https://site.com/employer/apply`)
- Кнопка «Оставить заявку» на будущем публичном сайте для работодателей

### Экран 1 — Информация о компании

Поля формы:
- **Название компании** (текст, обязательное)
- **Страна** (Select: UAE, Saudi Arabia, Qatar, Kuwait, Other)
- **Город** (текст)
- **Контактное лицо** (имя, обязательное)
- **WhatsApp / телефон** (обязательное, с валидацией формата)
- **Email** (необязательное)

Кнопка: **«Далее»** → переход на экран 2

UI: минималистичная форма на светлом фоне, mobile-first, брендинг Legacy. Прогресс-бар сверху (шаг 1 из 2).

---

### Экран 2 — Описание вакансии

Поля формы:
- **Позиция** (Select с поиском: Nail Master, Hair Stylist, Lash Maker, Makeup Artist, Waiter, Hostess, Receptionist, Cleaner, Cook, Other + свободный ввод)
- **Категория** (автоматически по выбранной позиции: Beauty / Hospitality / Other)
- **Количество мест** (число, по умолчанию 1)
- **Зарплата** (валюта Select: USD/AED/SAR/QAR/KWD + мин/макс)
- **График работы** (текст, placeholder: "6/1, 8 часов" или Select из шаблонов)
- **Условия проживания** (Select: предоставляется жильё / без жилья / компенсация)
- **Питание** (Select: включено / не включено / частично)
- **Срок контракта** (Select: 6 мес / 1 год / 2 года / Other)
- **Требования к кандидату** (Textarea: опыт, язык, возраст, внешний вид и т.д.)
- **Дополнительная информация** (Textarea, необязательное)

Кнопка: **«Отправить заявку»**

---

### Экран 3 — Подтверждение

После отправки показывается:

```
✅ Заявка отправлена!

Мы свяжемся с вами в течение 24 часов для уточнения деталей.

Номер заявки: #EMP-0042

[Написать в WhatsApp]
```

---

## 2. Квалификация работодателя (статусы заявки)

После отправки формы заявка попадает в дашборд рекрутера со статусом:

| Статус | Описание |
|--------|----------|
| **Новая** (New) | Только что поступила, ждёт проверки |
| **На проверке** (Under Review) | Рекрутер рассматривает |
| **Принята** (Approved) | Работодатель прошёл квалификацию, вакансия взята в работу |
| **Отклонена** (Rejected) | Не подходит (причина фиксируется) |
| **Приостановлена** (Paused) | Временно неактивна |

При смене статуса на "Принята" или "Отклонена" — отправляется уведомление работодателю в WhatsApp (вручную или автоматически — настраивается).

---

## 3. Дашборд рекрутера — раздел «Работодатели»

### Новый пункт в sidebar:

```
🏢 Employers                    — (новый пункт)
  ├── All Employers              → /employers
  └── Employer Vacancies         → /employers/vacancies
```

Расположение в sidebar: после «Candidates», перед «Telegram Messages».

---

### Страница «All Employers» (`/employers`)

**Toolbar:**
- Поиск (по названию компании, контактному лицу, телефону)
- Фильтры: статус (New / Under Review / Approved / Rejected / Paused), страна
- Кнопка: **«+ Add Employer»** → диалог ручного добавления

**Таблица (shadcn DataTable):**

| Company | Contact | Country | Status | Vacancies | Last Activity | Actions |
|---------|---------|---------|--------|-----------|---------------|---------|
| Al Barsha Salon | Ahmed K. | UAE | ✅ Approved | 3 | 2 days ago | View |
| Royal Hotel | Fatima M. | Qatar | 🆕 New | 1 | 5 min ago | View |

- **Status**: цветной Badge (New — синий, Under Review — жёлтый, Approved — зелёный, Rejected — красный, Paused — серый)
- **Vacancies**: число активных вакансий от этого работодателя
- **Last Activity**: дата последнего действия
- **Actions**: кнопка "View" → открывает карточку работодателя

**Новая заявка**: строка подсвечивается (как непрочитанное сообщение).

---

### Карточка работодателя (`/employers/:id`)

**Верхняя часть — информация о компании:**

```
┌──────────────────────────────────────────────┐
│  🏢 Al Barsha Beauty Salon                    │
│  Status: ✅ Approved  [Change Status ▼]       │
│                                              │
│  📍 Dubai, UAE                                │
│  👤 Ahmed Khalil (Contact)                    │
│  📱 +971 50 123 4567 (WhatsApp)               │
│  ✉️  ahmed@albarsha.ae                        │
│                                              │
│  Created: 15 Mar 2026  │  Vacancies: 3       │
│                                              │
│  [📱 WhatsApp]  [✏️ Edit]  [🗒 Notes]         │
└──────────────────────────────────────────────┘
```

- **Change Status**: Dropdown для смены статуса (New → Under Review → Approved / Rejected / Paused)
- **WhatsApp**: открывает WhatsApp с номером работодателя
- **Edit**: Sheet/Dialog для редактирования информации
- **Notes**: заметки рекрутера (как в заявках кандидатов)

---

**Нижняя часть — вакансии работодателя:**

Заголовок: **Vacancies (3)** + кнопка **«+ Создать вакансию»**

Карточки вакансий (grid или list):

```
┌─────────────────────────────────────────┐
│  💅 Nail Master                          │
│  💰 $2,000–2,500/mo  │  📅 1 year       │
│  Status: 🟡 Кандидаты отправлены         │
│  Candidates sent: 3  │  Matches: 8      │
│                                         │
│  [Открыть вакансию]  [Подобрать кандидатов] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  💇 Hair Stylist                         │
│  💰 $1,800–2,200/mo  │  📅 1 year       │
│  Status: 🟢 В работе                    │
│  Candidates sent: 0  │  Matches: 12     │
│                                         │
│  [Открыть вакансию]  [Подобрать кандидатов] │
└─────────────────────────────────────────┘
```

---

## 4. Карточка вакансии работодателя (`/employers/:id/vacancies/:vacancyId`)

### Верхняя часть — информация о вакансии:

```
┌─────────────────────────────────────────────────┐
│  💅 Nail Master — Al Barsha Beauty Salon         │
│  Status: 🟡 Кандидаты отправлены  [Change ▼]    │
│                                                 │
│  📍 Dubai, UAE                                   │
│  💰 $2,000–2,500/mo (USD)                        │
│  📅 Контракт: 1 год                              │
│  🕐 График: 6/1, 8 часов                         │
│  🏠 Жильё: предоставляется                       │
│  🍽️ Питание: включено                            │
│  👥 Мест: 2                                      │
│                                                 │
│  Требования:                                    │
│  • Опыт от 2 лет                                │
│  • Портфолио                                    │
│  • Базовый английский                           │
│                                                 │
│  [✏️ Edit]  [📱 Опубликовать в Telegram]          │
└─────────────────────────────────────────────────┘
```

---

### Блок «Подходящие кандидаты» (Matching Candidates)

Система автоматически подбирает кандидатов из существующей базы по критериям:
- Категория (Beauty/Hospitality) совпадает
- Позиция совпадает или близка
- Статус кандидата: COMPLETED или SHORTLISTED
- (Опционально) зарплатные ожидания кандидата ≤ предложение работодателя

**Таблица подходящих кандидатов:**

| | Name | Photo | Position | Experience | Score | Status | Actions |
|---|------|-------|----------|------------|-------|--------|---------|
| ☐ | Айгуль К. | 🖼 | Nail Master | 3 years | 87 | ✅ Completed | [Профиль] [Отправить] |
| ☐ | Марина С. | 🖼 | Nail Tech | 2 years | 82 | ✅ Completed | [Профиль] [Отправить] |
| ☐ | Лиза В. | 🖼 | Nail Master | 1.5 years | 75 | 🔵 Shortlisted | [Профиль] [Отправить] |

- **Photo**: миниатюра из MediaAsset (face photo)
- **Score**: AI score из заявки кандидата
- **Профиль**: открывает существующую страницу `/applications/:id`
- **Отправить**: помечает одного кандидата как "отправлен работодателю"

**Чекбоксы + массовое действие:**
- Выбрать несколько кандидатов галочками
- Кнопка **«Отправить выбранных работодателю»** (появляется при выборе)

---

## 5. Процесс отправки кандидатов работодателю

### При нажатии «Отправить работодателю» (одного или нескольких):

**Диалог подтверждения:**

```
┌─────────────────────────────────────────────┐
│  Отправить 3 кандидатов работодателю?        │
│                                             │
│  Работодатель: Al Barsha Beauty Salon       │
│  Вакансия: Nail Master                      │
│                                             │
│  ☑ Айгуль К. (Score: 87)                    │
│  ☑ Марина С. (Score: 82)                    │
│  ☑ Лиза В. (Score: 75)                      │
│                                             │
│  Метод отправки:                            │
│  ○ Только зафиксировать в системе           │
│  ○ Отправить резюме на WhatsApp             │
│  ○ Отправить резюме на Email                │
│                                             │
│  [Отменить]  [Отправить]                    │
└─────────────────────────────────────────────┘
```

**После подтверждения:**
- Каждый кандидат получает запись "отправлен работодателю X на вакансию Y" (дата, кем отправлен)
- Статус вакансии меняется на «Кандидаты отправлены» (если был «В работе»)
- В карточке вакансии появляется блок «Отправленные кандидаты»
- Если выбран метод "WhatsApp" или "Email" — генерируется DOCX-резюме (существующая функция) и прикрепляется

---

### Блок «Отправленные кандидаты» (в карточке вакансии)

Показывается под блоком "Подходящие кандидаты":

| Name | Sent Date | Sent By | Employer Response | Actions |
|------|-----------|---------|-------------------|---------|
| Айгуль К. | 28 Mar 2026 | admin | ⏳ Ожидание | [Профиль] |
| Марина С. | 28 Mar 2026 | admin | ✅ Принята на интервью | [Профиль] |
| Лиза В. | 28 Mar 2026 | admin | ❌ Не подошла | [Профиль] |

**Employer Response** — рекрутер вручную обновляет через dropdown:
- ⏳ Ожидание (Pending)
- ✅ Принята на интервью (Interview)
- ✅ Оффер (Offer)
- ✅ Нанята (Hired)
- ❌ Не подошла (Rejected)
- ❌ Нет ответа (No Response)

При смене на "Hired" — статус заявки кандидата в основной системе тоже обновляется до HIRED.

---

## 6. Статусы вакансии работодателя

| Статус | Цвет Badge | Описание |
|--------|-----------|----------|
| **Новая** (New) | 🔵 Синий | Только создана, ещё не обработана |
| **В работе** (In Progress) | 🟢 Зелёный | Рекрутер подбирает кандидатов |
| **Кандидаты отправлены** (Candidates Sent) | 🟡 Жёлтый | Резюме отправлены работодателю |
| **Интервью** (Interview) | 🟣 Фиолетовый | Работодатель проводит интервью |
| **Закрыта** (Closed) | ⚫ Серый | Вакансия закрыта (нанят / отменена) |
| **Приостановлена** (Paused) | ⚪ Светло-серый | Временно неактивна |

Смена статуса: dropdown в карточке вакансии.

---

## 7. Страница «Employer Vacancies» (`/employers/vacancies`)

Отдельная страница — все вакансии всех работодателей в одном месте.

**Toolbar:**
- Поиск (по позиции, компании)
- Фильтры: статус, категория (Beauty/Hospitality/Other), страна

**Таблица:**

| Position | Company | Country | Salary | Status | Sent | Matches | Actions |
|----------|---------|---------|--------|--------|------|---------|---------|
| Nail Master | Al Barsha Salon | UAE | $2,000–2,500 | 🟡 Sent | 3 | 8 | View |
| Waiter | Royal Hotel | Qatar | $1,000–1,500 | 🟢 In Progress | 0 | 15 | View |

- **Sent**: количество отправленных кандидатов
- **Matches**: количество подходящих кандидатов в системе
- **View**: открывает карточку вакансии

---

## 8. Уведомления (Telegram)

Через существующий Telegram-бот отправлять рекрутеру:

| Событие | Сообщение |
|---------|-----------|
| Новая заявка работодателя | `🏢 Новая заявка: "Al Barsha Salon" (Dubai, UAE) — Nail Master. #EMP-0042` |
| Работодатель ответил на кандидатов | `✅ Al Barsha Salon: Айгуль К. принята на интервью (Nail Master)` |
| Вакансия без кандидатов >3 дня | `⚠️ Вакансия "Waiter" (Royal Hotel) — нет подходящих кандидатов 3 дня` |
| Вакансия закрыта (hired) | `🎉 Вакансия закрыта: Nail Master @ Al Barsha Salon — нанята Айгуль К.` |

Уведомления отправляются в чат рекрутера (настраивается в Settings).

---

## 9. Связь с существующей системой

### С Candidates/Applications:
- Matching кандидатов по категории, позиции, статусу
- При отправке кандидата → связь `Application ↔ EmployerVacancy` (many-to-many через промежуточную таблицу)
- При найме → обновление статуса Application до HIRED

### С Vacancies (существующие):
- Вакансии работодателей — **отдельная сущность** от внутренних вакансий (Vacancy model)
- Но можно привязать: при создании вакансии работодателя → автоматически создаётся внутренняя Vacancy (для Telegram-бота, чтобы кандидаты подавались через бот)
- Кнопка в карточке вакансии: **«Создать вакансию для бота»** → создаёт Vacancy с теми же данными

### С Notion:
- (Опционально) синхронизация работодателей в отдельную Notion-базу
- Пока не в MVP — добавить позже

---

## 10. Бэкенд: Django-приложение `employers`

### Создать: `backend/apps/employers/`

```
backend/apps/employers/
├── __init__.py
├── apps.py
├── models.py          # Employer, EmployerVacancy, CandidateSubmission
├── serializers.py     # DRF serializers
├── views.py           # DRF ViewSets + публичная форма
├── urls.py            # URL-паттерны
├── tasks.py           # Celery: уведомления, matching
├── services/
│   ├── __init__.py
│   ├── matching.py    # Подбор кандидатов по критериям
│   └── notifications.py  # Telegram-уведомления
├── admin.py
└── migrations/
```

---

### Django-модели (`models.py`)

```python
from django.db import models


class Employer(models.Model):
    """Работодатель — компания, которая ищет сотрудников."""

    STATUS_CHOICES = [
        ("new", "New"),
        ("under_review", "Under Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("paused", "Paused"),
    ]

    company_name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True)
    contact_name = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=50)
    contact_email = models.EmailField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    rejection_reason = models.TextField(blank=True)
    recruiter_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "employers"
        ordering = ["-created_at"]

    def __str__(self):
        return self.company_name

    @property
    def vacancy_count(self):
        return self.vacancies.count()


class EmployerVacancy(models.Model):
    """Вакансия от конкретного работодателя."""

    STATUS_CHOICES = [
        ("new", "New"),
        ("in_progress", "In Progress"),
        ("candidates_sent", "Candidates Sent"),
        ("interview", "Interview"),
        ("closed", "Closed"),
        ("paused", "Paused"),
    ]

    CATEGORY_CHOICES = [
        ("beauty", "Beauty"),
        ("hospitality", "Hospitality"),
        ("other", "Other"),
    ]

    HOUSING_CHOICES = [
        ("provided", "Provided"),
        ("not_provided", "Not Provided"),
        ("compensation", "Compensation"),
    ]

    MEALS_CHOICES = [
        ("included", "Included"),
        ("not_included", "Not Included"),
        ("partial", "Partial"),
    ]

    employer = models.ForeignKey(Employer, on_delete=models.CASCADE,
                                 related_name="vacancies")
    position = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    spots = models.IntegerField(default=1, help_text="Количество мест")

    salary_currency = models.CharField(max_length=5, default="USD")
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)

    schedule = models.CharField(max_length=255, blank=True)
    housing = models.CharField(max_length=20, choices=HOUSING_CHOICES,
                               blank=True)
    meals = models.CharField(max_length=20, choices=MEALS_CHOICES, blank=True)
    contract_duration = models.CharField(max_length=50, blank=True,
                                         help_text="6 мес / 1 год / 2 года")
    requirements = models.TextField(blank=True)
    additional_info = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                              default="new")

    # Привязка к внутренней вакансии (для бота)
    internal_vacancy = models.ForeignKey(
        'vacancies.Vacancy', on_delete=models.SET_NULL,
        null=True, blank=True, related_name="employer_vacancies"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "employer_vacancies"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.position} @ {self.employer.company_name}"

    @property
    def candidates_sent_count(self):
        return self.submissions.count()


class CandidateSubmission(models.Model):
    """Запись об отправке кандидата работодателю."""

    RESPONSE_CHOICES = [
        ("pending", "Pending"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("hired", "Hired"),
        ("rejected", "Rejected"),
        ("no_response", "No Response"),
    ]

    employer_vacancy = models.ForeignKey(EmployerVacancy, on_delete=models.CASCADE,
                                         related_name="submissions")
    application = models.ForeignKey('applications.Application',
                                    on_delete=models.CASCADE,
                                    related_name="employer_submissions")
    sent_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL,
                                null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    send_method = models.CharField(max_length=20, blank=True,
                                   help_text="system / whatsapp / email")
    employer_response = models.CharField(max_length=20,
                                         choices=RESPONSE_CHOICES,
                                         default="pending")
    response_notes = models.TextField(blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "candidate_submissions"
        ordering = ["-sent_at"]
        unique_together = ["employer_vacancy", "application"]

    def __str__(self):
        return f"{self.application} → {self.employer_vacancy}"
```

---

### API-эндпоинты (`urls.py`)

```python
# backend/apps/employers/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.EmployerViewSet, basename='employer')

urlpatterns = [
    # Публичная форма (без авторизации)
    path('public/apply/', views.PublicEmployerApplicationView.as_view()),

    # Авторизованные эндпоинты
    path('', include(router.urls)),

    # Вакансии работодателя
    path('<int:employer_id>/vacancies/', views.EmployerVacancyListCreateView.as_view()),
    path('<int:employer_id>/vacancies/<int:vacancy_id>/', views.EmployerVacancyDetailView.as_view()),

    # Подходящие кандидаты для вакансии
    path('<int:employer_id>/vacancies/<int:vacancy_id>/matches/',
         views.MatchingCandidatesView.as_view()),

    # Отправка кандидатов работодателю
    path('<int:employer_id>/vacancies/<int:vacancy_id>/submit/',
         views.SubmitCandidatesView.as_view()),

    # Отправленные кандидаты
    path('<int:employer_id>/vacancies/<int:vacancy_id>/submissions/',
         views.SubmissionListView.as_view()),

    # Обновить ответ работодателя по кандидату
    path('submissions/<int:submission_id>/response/',
         views.UpdateSubmissionResponseView.as_view()),

    # Все вакансии всех работодателей (для /employers/vacancies)
    path('all-vacancies/', views.AllEmployerVacanciesView.as_view()),

    # Создать внутреннюю вакансию из вакансии работодателя
    path('<int:employer_id>/vacancies/<int:vacancy_id>/create-internal/',
         views.CreateInternalVacancyView.as_view()),
]
```

Регистрация: `path('api/employers/', include('apps.employers.urls'))` в корневом `urls.py`.

Публичный эндпоинт `public/apply/` — **без авторизации** (AllowAny). Все остальные — `IsAuthenticated`.

---

### Celery Tasks (`tasks.py`)

```python
@shared_task
def notify_new_employer_application(employer_id):
    """Уведомить рекрутера в Telegram о новой заявке работодателя."""
    pass

@shared_task
def notify_vacancy_without_candidates(vacancy_id):
    """Уведомить если вакансия без кандидатов >3 дней."""
    pass

@shared_task
def notify_candidate_hired(submission_id):
    """Уведомить при найме кандидата (response=hired)."""
    pass

@shared_task
def check_stale_vacancies():
    """Периодическая проверка: вакансии в статусе 'in_progress' без отправленных кандидатов >3 дня."""
    pass
```

Celery Beat:
```python
'employers-check-stale': {
    'task': 'apps.employers.tasks.check_stale_vacancies',
    'schedule': crontab(hour=9, minute=0),  # Каждый день в 09:00
},
```

---

### Фронтенд: новые файлы

```
frontend/src/
├── pages/employers/
│   ├── EmployersPage.tsx           # Список работодателей (/employers)
│   ├── EmployerDetailPage.tsx      # Карточка работодателя (/employers/:id)
│   ├── EmployerVacancyPage.tsx     # Карточка вакансии (/employers/:id/vacancies/:vid)
│   ├── AllEmployerVacanciesPage.tsx # Все вакансии (/employers/vacancies)
│   └── EmployerPublicForm.tsx      # Публичная форма (без авторизации)
│
├── components/employers/
│   ├── EmployerStatusBadge.tsx     # Badge статуса работодателя
│   ├── VacancyStatusBadge.tsx      # Badge статуса вакансии
│   ├── VacancyCard.tsx             # Карточка вакансии в списке
│   ├── MatchingCandidatesTable.tsx # Таблица подходящих кандидатов
│   ├── SubmissionsTable.tsx        # Таблица отправленных кандидатов
│   ├── SubmitCandidatesDialog.tsx  # Диалог подтверждения отправки
│   └── ResponseDropdown.tsx        # Dropdown ответа работодателя
│
└── lib/
    └── employers-api.ts            # API-клиент (паттерн api.ts)
```

---

## 11. Роуты (react-router)

Добавить в `App.tsx`:

```
/employers                           → EmployersPage
/employers/vacancies                 → AllEmployerVacanciesPage
/employers/:id                       → EmployerDetailPage
/employers/:id/vacancies/:vacancyId  → EmployerVacancyPage
/employer/apply                      → EmployerPublicForm (без layout дашборда)
```

---

## 12. Приоритеты реализации

### Фаза 1 — MVP (1.5 недели)
1. Django app `employers/`: модели + миграции
2. Публичная форма (2 экрана + подтверждение)
3. DRF ViewSets: CRUD работодателей и вакансий
4. Фронтенд: EmployersPage (таблица), EmployerDetailPage (карточка)
5. Sidebar: пункт "Employers"
6. `employers-api.ts`

### Фаза 2 — Matching + Submissions (1 неделя)
1. Matching-сервис (подбор кандидатов по критериям)
2. MatchingCandidatesTable в карточке вакансии
3. SubmitCandidatesDialog + CandidateSubmission CRUD
4. SubmissionsTable с dropdown ответа работодателя
5. При hired → обновление статуса Application

### Фаза 3 — Уведомления + интеграции (1 неделя)
1. Telegram-уведомления через существующий бот
2. Celery task: check_stale_vacancies
3. Кнопка "Создать вакансию для бота" → привязка к Vacancy
4. AllEmployerVacanciesPage
5. Статистика в карточке работодателя

---

## 13. Важные правила

1. **Следовать стилю проекта** — смотреть `VacanciesPage.tsx`, `ApplicationDetailPage.tsx` и делать так же
2. **shadcn/ui**: Button, Card, DataTable, Dialog, Sheet, Select, Badge, Switch, Tabs, Toast, Dropdown
3. **Тёмная тема** — все компоненты
4. **TypeScript** — строгая типизация
5. **Публичная форма** — отдельный layout (без sidebar), mobile-first, без авторизации
6. **Не трогать существующие модели** — только добавлять ForeignKey из новых моделей к существующим (Application, Vacancy)
7. **Matching** — начать с простого фильтра (категория + позиция + статус кандидата), потом усложнять
