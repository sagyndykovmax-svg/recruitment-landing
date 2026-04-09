# Промпт: Модуль «Календарь / Интервью» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL. Фронтенд: React 18 + TS + shadcn/ui. Telegram-бот интегрирован.

Интервью между кандидатами и работодателями планируются через мессенджеры. Нет единого календаря, нет напоминаний, легко забыть или запутаться.

---

## Задача

Добавить модуль **«Calendar / Interviews»** — планирование и отслеживание интервью.

---

## Sidebar

```
📅 Interviews         → /interviews
```

---

## 1. Страница Interviews (`/interviews`)

### Два режима отображения (Toggle):

**Режим "List" (по умолчанию):**

Таблица:

| Date & Time | Candidate | Employer | Position | Format | Status | Actions |
|------------|-----------|----------|----------|--------|--------|---------|
| 05.04.2026 14:00 | Айгуль К. | Al Barsha Salon | Nail Master | Video | 🟢 Scheduled | View / Cancel |
| 07.04.2026 11:00 | Дмитрий М. | Royal Hotel | Waiter | In-person | 🟡 Rescheduled | View |

Фильтры: период, статус, работодатель, формат

**Режим "Calendar":**

Календарная сетка (неделя/месяц) с интервью как событиями.
- Каждое событие — цветной блок с именем кандидата и компанией
- Клик → открывает детали
- Библиотека: компонент на основе простой CSS-сетки (не тяжёлый FullCalendar)

---

## 2. Создание интервью

Кнопка **"+ Schedule Interview"** → Dialog:

```
Кандидат: [Select — поиск по имени]
Работодатель: [Select — из Employers]
Вакансия: [Select — вакансии этого работодателя]

Дата: [DatePicker]
Время: [TimePicker]
Длительность: [Select: 15 мин / 30 мин / 1 час]

Формат: [Select]
  ○ Video Call (ссылка)
  ○ Phone Call
  ○ In-person (адрес)

Ссылка / Адрес: [Input — если Video или In-person]

Заметки: [Textarea]

Уведомить:
  ☑ Кандидата (Telegram)
  ☑ Работодателя (WhatsApp — вручную)

[Отменить]  [Запланировать]
```

**Также:** кнопка "Schedule Interview" появляется в карточке EmployerVacancy (при статусе "Interview") и в CandidateSubmission.

---

## 3. Карточка интервью (`/interviews/:id`)

```
┌─────────────────────────────────────────────┐
│  📅 Интервью — 05.04.2026, 14:00            │
│  Status: 🟢 Scheduled  [Change ▼]           │
│                                             │
│  👤 Кандидат: Айгуль К.  [→ Профиль]        │
│  🏢 Работодатель: Al Barsha Salon [→ Profile]│
│  💼 Вакансия: Nail Master                    │
│                                             │
│  📹 Формат: Video Call                       │
│  🔗 Ссылка: https://meet.google.com/abc-xyz │
│  ⏱ Длительность: 30 минут                   │
│                                             │
│  Заметки рекрутера:                         │
│  "Работодатель просит показать портфолио"   │
│                                             │
│  [✏️ Edit]  [❌ Cancel]  [✅ Mark Completed] │
└─────────────────────────────────────────────┘

Результат (после интервью):
┌─────────────────────────────────────────────┐
│  Результат: [Select]                         │
│    ○ Успешно — работодатель доволен          │
│    ○ Нужно повторное интервью                │
│    ○ Не подошёл                              │
│                                             │
│  Комментарий: [Textarea]                    │
│  [Сохранить результат]                      │
└─────────────────────────────────────────────┘
```

---

## 4. Статусы интервью

| Статус | Badge | Описание |
|--------|-------|----------|
| Scheduled | 🟢 Зелёный | Запланировано |
| Rescheduled | 🟡 Жёлтый | Перенесено (сохраняется история) |
| Completed | 🔵 Синий | Проведено |
| Cancelled | ⚫ Серый | Отменено |
| No Show | 🔴 Красный | Кандидат/работодатель не явился |

---

## 5. Напоминания (Celery + Telegram)

| Когда | Кому | Сообщение |
|-------|------|-----------|
| За 24 часа | Кандидату (Telegram) | `📅 Напоминание: завтра в 14:00 у вас интервью с Al Barsha Salon (Nail Master). Формат: видеозвонок.` |
| За 1 час | Кандидату (Telegram) | `⏰ Через 1 час — интервью с Al Barsha Salon. Ссылка: https://meet...` |
| За 24 часа | Рекрутеру (Telegram) | `📅 Завтра: 3 интервью запланировано. 14:00 Айгуль К., 15:00 Марина С., 16:00 Дмитрий М.` |
| После интервью (2 часа) | Рекрутеру | `✍️ Не забудьте внести результат интервью: Айгуль К. — Al Barsha Salon` |

---

## 6. Бэкенд

### `backend/apps/interviews/`

**Модели:**
```python
class Interview(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("rescheduled", "Rescheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("no_show", "No Show"),
    ]
    FORMAT_CHOICES = [
        ("video", "Video Call"),
        ("phone", "Phone Call"),
        ("in_person", "In-person"),
    ]
    RESULT_CHOICES = [
        ("successful", "Successful"),
        ("retry", "Needs Retry"),
        ("rejected", "Not Suitable"),
    ]

    application = models.ForeignKey('applications.Application',
                                     on_delete=models.CASCADE, related_name="interviews")
    employer_vacancy = models.ForeignKey('employers.EmployerVacancy',
                                         on_delete=models.CASCADE, related_name="interviews")
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    location_or_link = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, blank=True)
    result_notes = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "interviews"
        ordering = ["scheduled_at"]
```

**API:**
```
GET    /api/interviews/               — список (фильтры: period, status, employer)
POST   /api/interviews/               — создать
GET    /api/interviews/:id/           — детали
PATCH  /api/interviews/:id/           — обновить (статус, результат)
DELETE /api/interviews/:id/           — удалить
GET    /api/interviews/calendar/      — данные для календарного вида (по неделе/месяцу)
GET    /api/interviews/upcoming/      — ближайшие 5 интервью (для виджета в overview)
```

**Celery Beat:**
```python
'interviews-remind-24h': {
    'task': 'apps.interviews.tasks.send_24h_reminders',
    'schedule': crontab(hour=10, minute=0),  # Каждый день 10:00
},
'interviews-remind-1h': {
    'task': 'apps.interviews.tasks.send_1h_reminders',
    'schedule': crontab(minute='*/30'),  # Каждые 30 минут
},
'interviews-nudge-result': {
    'task': 'apps.interviews.tasks.nudge_for_results',
    'schedule': crontab(hour='*/2'),  # Каждые 2 часа
},
```

---

## 7. Фронтенд

```
frontend/src/pages/
├── InterviewsPage.tsx          # Список + календарь (toggle)
└── InterviewDetailPage.tsx     # Карточка интервью

frontend/src/components/interviews/
├── InterviewStatusBadge.tsx
├── ScheduleInterviewDialog.tsx
├── InterviewResultForm.tsx
├── CalendarGrid.tsx            # Простая CSS-сетка (неделя/месяц)
├── CalendarEvent.tsx           # Одно событие в календаре
└── UpcomingInterviews.tsx      # Виджет для overview

frontend/src/lib/
└── interviews-api.ts
```

---

## Приоритеты

### Фаза 1 (4 дня): Модель, CRUD, список интервью, создание, статусы
### Фаза 2 (3 дня): Календарный вид, результат интервью, привязка к EmployerVacancy
### Фаза 3 (2 дня): Celery напоминания через Telegram, виджет upcoming
