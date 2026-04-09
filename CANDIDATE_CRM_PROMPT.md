# Промпт: Модуль «CRM кандидатов / Retention» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL. Фронтенд: React 18 + TS + shadcn/ui. Telegram-бот интегрирован.

Сейчас жизненный цикл кандидата заканчивается на статусе HIRED. Но реальность: контракт длится 1–2 года → заканчивается → кандидат либо продлевает, либо ищет новое место, либо уходит. Бывшие кандидаты — самый ценный актив (уже проверены, адаптированы, понимают процесс). Их повторное трудоустройство стоит дешевле и быстрее.

---

## Задача

Добавить модуль **«Candidate CRM»** — отслеживание полного жизненного цикла кандидата после найма: работа по контракту, завершение, повторное размещение, рейтинг.

---

## Sidebar

Не новый пункт, а **расширение существующего Candidates:**

```
👤 Candidates         → /candidates      (существующий)
   ├── Active         → /candidates?status=active
   ├── Working        → /candidates?status=working
   ├── Alumni         → /candidates?status=alumni
   └── Blacklist      → /candidates?status=blacklisted
```

---

## 1. Расширенные статусы кандидата

Сейчас Application имеет статусы до найма. Нужен **lifecycle status кандидата** (отдельно от Application):

| Lifecycle Status | Описание |
|-----------------|----------|
| **Active** | В процессе (заполняет анкету, проходит отбор) |
| **Working** | Работает по контракту (нанят, уехал) |
| **Contract Ending** | Контракт заканчивается в ближайшие 30 дней |
| **Alumni** | Закончил контракт, доступен для повторного размещения |
| **Re-placed** | Повторно трудоустроен |
| **Inactive** | Не отвечает, потерял интерес |
| **Blacklisted** | Чёрный список (проблемы, нарушения) |

---

## 2. Карточка кандидата — новые блоки

### В существующую `ApplicationDetailPage` / `CandidateDetailPage` добавить табы:

**Tab "Employment History" (История трудоустройства):**

Таймлайн всех размещений кандидата:

```
📍 Текущее размещение:
┌─────────────────────────────────────────────┐
│  💅 Nail Master — Al Barsha Salon, Dubai     │
│  📅 01.04.2026 — 31.03.2027 (1 год)         │
│  Status: 🟢 Working                         │
│  Осталось: 243 дня                          │
│                                             │
│  Рейтинг работодателя: ⭐⭐⭐⭐⭐ (ещё нет)    │
│  Заметки: "Работодатель доволен"            │
└─────────────────────────────────────────────┘

📍 Предыдущее:
┌─────────────────────────────────────────────┐
│  ❌ Отказ — Royal Hotel, Qatar               │
│  📅 Интервью 15.02.2026                      │
│  Причина: не прошла интервью                │
└─────────────────────────────────────────────┘
```

**Tab "Feedback & Rating" (Оценки):**

После завершения каждого контракта:

```
Оценка от работодателя:
  Профессионализм: ⭐⭐⭐⭐⭐ (5/5)
  Пунктуальность: ⭐⭐⭐⭐ (4/5)
  Коммуникация: ⭐⭐⭐⭐⭐ (5/5)
  Общая: ⭐⭐⭐⭐⭐ (4.7/5)
  Комментарий: "Отличный мастер, клиенты довольны"

Оценка от кандидата (опционально):
  Условия работы: ⭐⭐⭐⭐ (4/5)
  Жильё: ⭐⭐⭐ (3/5)
  Коммуникация: ⭐⭐⭐⭐⭐ (5/5)
  Комментарий: "Жильё могло быть лучше, но в целом хорошо"
```

**Tab "Notes & Timeline":**

Хронологический лог всех взаимодействий:
```
31.03.2027 — Контракт завершён. Статус: Alumni
15.03.2027 — Напоминание отправлено: "Контракт заканчивается через 16 дней"
01.04.2026 — Нанята. Al Barsha Salon, Dubai. Nail Master.
28.03.2026 — Отправлена работодателю
15.03.2026 — Анкета завершена (100%)
10.03.2026 — Начала заполнение анкеты
```

---

## 3. Placement (Размещение)

Новая модель — привязка кандидата к конкретному трудоустройству:

```
Placement:
  - Кандидат (Application)
  - Работодатель (Employer)
  - Вакансия (EmployerVacancy)
  - Дата начала
  - Дата окончания контракта
  - Статус: Active / Completed / Terminated Early / Extended
  - Причина завершения
  - Рейтинг от работодателя (JSON: {professionalism, punctuality, communication, overall})
  - Рейтинг от кандидата (JSON)
  - Заметки
```

**Создание:** автоматически при `CandidateSubmission.employer_response = 'hired'` → создать Placement (draft), рекрутер заполняет даты.

**При приближении конца контракта (за 30 дней):**
- Статус кандидата → Contract Ending
- Telegram-уведомление рекрутеру
- Рекрутер решает: продление / повторное размещение / завершение

---

## 4. Страница Candidates — обновлённая (`/candidates`)

### Подтабы:

**Active (по умолчанию):**
Кандидаты в процессе (NEW → COMPLETED → SHORTLISTED). Текущий функционал.

**Working:**
Кандидаты с активным Placement. Таблица:

| Name | Position | Employer | Country | Contract End | Days Left | Rating | Actions |
|------|----------|----------|---------|-------------|-----------|--------|---------|
| Айгуль К. | Nail Master | Al Barsha | UAE | 31.03.2027 | 243 | — | View |
| Дмитрий М. | Waiter | Royal Hotel | Qatar | 15.09.2026 | 45 | — | View |

- Days Left: красный если <30, жёлтый если <60
- Rating: звёзды (если есть)

**Alumni:**
Кандидаты с завершённым Placement. Доступны для повторного размещения.

| Name | Last Position | Last Employer | Contract End | Rating | Re-place? | Actions |
|------|-------------|---------------|-------------|--------|-----------|---------|
| Марина С. | Lash Maker | Beauty Palace | 01.01.2026 | ⭐4.5 | 🟢 Available | View / Re-place |

- Кнопка **"Re-place"** → создаёт новую Application для этого кандидата (с предзаполненными данными)

**Blacklist:**
Кандидаты в чёрном списке. Причина, дата, кто добавил.

---

## 5. Повторное размещение (Re-placement)

При нажатии **"Re-place"** на Alumni кандидате:

1. Создаётся новая Application (статус NEW) с данными из предыдущей (не нужно заново заполнять анкету)
2. Привязывается к тому же Candidate
3. Рекрутер видит историю: "Повторное размещение. Предыдущий контракт: Al Barsha Salon, рейтинг 4.7/5"
4. Кандидат проходит сокращённый flow (только подтверждение актуальности данных + новые фото если нужно)

---

## 6. Уведомления (Celery + Telegram)

| Событие | Когда | Кому | Сообщение |
|---------|-------|------|-----------|
| Контракт заканчивается | За 30 дней | Рекрутеру | `📅 Контракт Айгуль К. (Al Barsha Salon) заканчивается 31.03.2027. Действие?` |
| Контракт заканчивается | За 7 дней | Рекрутеру | `⚠️ Через 7 дней: контракт Айгуль К. Статус: не определён` |
| Контракт завершён | В день | Автоматически | Статус → Alumni, уведомление рекрутеру |
| Alumni без размещения >60 дней | Еженедельно | Рекрутеру | `📋 5 кандидатов Alumni >60 дней без повторного размещения` |
| Запрос рейтинга | Через 7 дней после завершения | Рекрутеру | `⭐ Запросите отзыв у Al Barsha Salon о Айгуль К.` |

---

## 7. Бэкенд

### `backend/apps/crm/`

```
backend/apps/crm/
├── models.py          # Placement, CandidateRating
├── serializers.py
├── views.py
├── urls.py
├── tasks.py           # Celery: contract reminders, auto-status-change
├── services/
│   ├── placement.py   # Создание/завершение placement
│   └── replace.py     # Повторное размещение
└── migrations/
```

**Модели:**
```python
class Placement(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("terminated", "Terminated Early"),
        ("extended", "Extended"),
    ]

    application = models.ForeignKey('applications.Application',
                                     on_delete=models.CASCADE, related_name="placements")
    employer = models.ForeignKey('employers.Employer', on_delete=models.CASCADE,
                                 related_name="placements")
    employer_vacancy = models.ForeignKey('employers.EmployerVacancy',
                                         on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    termination_reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "placements"
        ordering = ["-start_date"]

    @property
    def days_remaining(self):
        from django.utils import timezone
        if self.status == "active":
            return (self.end_date - timezone.now().date()).days
        return None


class CandidateRating(models.Model):
    RATER_CHOICES = [
        ("employer", "By Employer"),
        ("candidate", "By Candidate"),
    ]

    placement = models.ForeignKey(Placement, on_delete=models.CASCADE,
                                   related_name="ratings")
    rater_type = models.CharField(max_length=20, choices=RATER_CHOICES)
    professionalism = models.IntegerField(null=True, help_text="1–5")
    punctuality = models.IntegerField(null=True, help_text="1–5")
    communication = models.IntegerField(null=True, help_text="1–5")
    overall = models.FloatField(null=True, help_text="Средняя оценка")
    comment = models.TextField(blank=True)
    rated_by_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "candidate_ratings"
        unique_together = ["placement", "rater_type"]
```

**Также добавить к модели Candidate:**
```python
lifecycle_status = models.CharField(max_length=20, default="active",
    choices=[
        ("active", "Active"),
        ("working", "Working"),
        ("contract_ending", "Contract Ending"),
        ("alumni", "Alumni"),
        ("re_placed", "Re-placed"),
        ("inactive", "Inactive"),
        ("blacklisted", "Blacklisted"),
    ])
```

**API:**
```
# Placements
GET    /api/crm/placements/                    — список размещений
POST   /api/crm/placements/                    — создать
PATCH  /api/crm/placements/:id/               — обновить
POST   /api/crm/placements/:id/complete/       — завершить контракт
POST   /api/crm/placements/:id/extend/         — продлить контракт

# Ratings
POST   /api/crm/placements/:id/rate/           — добавить оценку
GET    /api/crm/placements/:id/ratings/         — оценки по placement

# Re-placement
POST   /api/crm/candidates/:id/re-place/        — создать новую заявку из Alumni

# Lifecycle
GET    /api/crm/candidates/working/             — работающие кандидаты
GET    /api/crm/candidates/alumni/              — alumni
GET    /api/crm/candidates/contract-ending/     — контракты заканчиваются скоро
GET    /api/crm/candidates/blacklist/           — чёрный список
POST   /api/crm/candidates/:id/blacklist/       — добавить в ЧС
```

**Celery Beat:**
```python
'crm-check-contracts': {
    'task': 'apps.crm.tasks.check_expiring_contracts',
    'schedule': crontab(hour=8, minute=0),  # Каждый день 08:00
},
'crm-auto-complete': {
    'task': 'apps.crm.tasks.auto_complete_expired_contracts',
    'schedule': crontab(hour=1, minute=0),  # Каждый день 01:00
},
'crm-alumni-reminder': {
    'task': 'apps.crm.tasks.remind_alumni_without_placement',
    'schedule': crontab(hour=9, minute=0, day_of_week=1),  # Пн 09:00
},
```

---

## 8. Фронтенд

```
frontend/src/pages/crm/
├── WorkingCandidatesPage.tsx       # Таблица работающих
└── AlumniPage.tsx                  # Таблица alumni

frontend/src/components/crm/
├── PlacementTimeline.tsx           # Таймлайн размещений в карточке кандидата
├── PlacementCard.tsx               # Карточка одного размещения
├── RatingStars.tsx                 # Компонент звёзд (input + display)
├── RatingForm.tsx                  # Форма оценки
├── ContractCountdown.tsx           # "Осталось X дней" с цветом
├── LifecycleStatusBadge.tsx        # Badge статуса жизненного цикла
└── ReplacementDialog.tsx           # Диалог повторного размещения

frontend/src/lib/
└── crm-api.ts
```

---

## Приоритеты

### Фаза 1 (1 неделя): Placement модель, lifecycle_status, WorkingCandidatesPage, PlacementTimeline
### Фаза 2 (4 дня): CandidateRating, RatingForm, AlumniPage, Re-placement flow
### Фаза 3 (3 дня): Celery: contract reminders, auto-complete, alumni reminders, Blacklist

---

## Важные правила

1. **Candidate ≠ Application** — один кандидат может иметь несколько Applications (повторные размещения)
2. **Placement создаётся при hired** — автоматически, рекрутер только заполняет даты
3. **Rating — после завершения контракта** — не раньше
4. **Alumni — самый ценный сегмент** — они должны быть на виду, с лёгким доступом к re-placement
5. **lifecycle_status** — на уровне Candidate (не Application), обновляется автоматически через Celery
