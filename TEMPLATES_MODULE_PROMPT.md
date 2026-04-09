# Промпт: Модуль «Шаблоны сообщений» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL. Фронтенд: React 18 + TS + shadcn/ui. Telegram-бот уже интегрирован.

Рекрутеры отправляют одни и те же сообщения десятки раз в день: "ваше резюме отправлено", "подготовьте документы", "вас пригласили на интервью". Сейчас каждый раз набирают вручную. Нужна библиотека шаблонов с переменными.

---

## Задача

Добавить модуль **«Message Templates»** — библиотека готовых сообщений с переменными, отправка кандидатам через Telegram-бот одной кнопкой.

---

## Sidebar

```
💬 Templates          → /templates
```

---

## 1. Страница Templates (`/templates`)

### Категории шаблонов (Tabs):

| Категория | Примеры |
|-----------|---------|
| **Candidate** | Приветствие, статус заявки, запрос документов, поздравление с наймом |
| **Employer** | Отправка резюме, уточнение условий, статус кандидата |
| **Internal** | Напоминания рекрутерам, эскалации |

### Таблица шаблонов:

| Name | Category | Language | Variables | Last Used | Actions |
|------|----------|----------|-----------|-----------|---------|
| Резюме отправлено | Candidate | RU | {name}, {company}, {position} | 2h ago | Edit / Send |
| Приглашение на интервью | Candidate | RU | {name}, {company}, {date}, {time} | 1d ago | Edit / Send |
| Подготовьте документы | Candidate | RU | {name}, {documents_list} | 3d ago | Edit / Send |

Кнопка: **"+ Create Template"**

---

## 2. Создание/редактирование шаблона

**Форма:**
```
Название: [Input]
Категория: [Select: Candidate / Employer / Internal]
Язык: [Select: RU / EN]

Текст сообщения:
┌──────────────────────────────────────────────────────────┐
│ Здравствуйте, {name}!                                    │
│                                                          │
│ Ваше резюме отправлено в компанию {company} на позицию   │
│ {position}.                                              │
│                                                          │
│ Мы свяжемся с вами, как только получим обратную связь    │
│ от работодателя.                                         │
│                                                          │
│ С уважением, команда Legacy.                             │
└──────────────────────────────────────────────────────────┘

Доступные переменные:
  [+name] [+company] [+position] [+country] [+salary]
  [+date] [+time] [+documents_list] [+recruiter_name]
```

- Клик по переменной → вставляет `{variable}` в текст на позицию курсора
- **Превью** справа — показывает сообщение с подставленными примерными значениями
- Подсветка переменных в тексте (другой цвет)

---

## 3. Отправка сообщения кандидату

### Вариант A — из карточки кандидата (ApplicationDetailPage):

Новая кнопка **"📩 Send Template"** в toolbar.

При клике → Dialog:
```
┌─────────────────────────────────────────────┐
│  Отправить сообщение — Айгуль К.            │
│                                             │
│  Шаблон: [Select — список шаблонов]         │
│                                             │
│  Превью:                                    │
│  ┌─────────────────────────────────────┐    │
│  │ Здравствуйте, Айгуль!              │    │
│  │                                     │    │
│  │ Ваше резюме отправлено в компанию   │    │
│  │ Al Barsha Salon на позицию Nail     │    │
│  │ Master.                             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ✏️ [Редактировать перед отправкой]          │
│                                             │
│  [Отменить]  [📩 Отправить в Telegram]      │
└─────────────────────────────────────────────┘
```

- Переменные подставляются автоматически из данных кандидата/заявки
- Кнопка "Редактировать" → текст становится редактируемым (можно поправить перед отправкой)
- "Отправить в Telegram" → Celery task → `bot.send_message(candidate.telegram_chat_id, text)`
- После отправки → сообщение сохраняется в `Message` (direction=OUTBOUND, sender=RECRUITER)

### Вариант B — массовая отправка из таблицы Applications:

- Выбрать несколько кандидатов (чекбоксы)
- Кнопка **"📩 Send Template"** в bulk actions
- Один шаблон → отправляется каждому с подставленными персональными данными
- Показать превью первого кандидата + "и ещё 4 получателей"

---

## 4. Доступные переменные

| Переменная | Источник | Пример |
|-----------|----------|--------|
| `{name}` | `Candidate.full_name` | Айгуль К. |
| `{first_name}` | Первое слово из full_name | Айгуль |
| `{phone}` | `Candidate.phone_number` | +7 999 123 4567 |
| `{position}` | `Application.vacancy.title` или `Candidate.desired_position` | Nail Master |
| `{category}` | `Application.vacancy.category` | Beauty |
| `{company}` | `EmployerVacancy.employer.company_name` (если привязан) | Al Barsha Salon |
| `{country}` | `EmployerVacancy.employer.country` | UAE |
| `{city}` | `EmployerVacancy.employer.city` | Dubai |
| `{salary}` | `EmployerVacancy.salary_min–salary_max` | $2,000–2,500 |
| `{date}` | Указывается вручную при отправке | 05.04.2026 |
| `{time}` | Указывается вручную | 14:00 |
| `{documents_list}` | Список незаполненных документов из модуля Documents | Виза, Медосмотр |
| `{recruiter_name}` | Текущий пользователь | Максим |

Если переменная не может быть подставлена (нет данных) → подсвечивается красным в превью, отправка блокируется с сообщением "Заполните недостающие данные".

---

## 5. Бэкенд

### `backend/apps/templates/`

**Модели:**
```python
class MessageTemplate(models.Model):
    CATEGORY_CHOICES = [
        ("candidate", "Candidate"),
        ("employer", "Employer"),
        ("internal", "Internal"),
    ]
    LANGUAGE_CHOICES = [
        ("ru", "Russian"),
        ("en", "English"),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default="ru")
    body = models.TextField(help_text="Текст с переменными в формате {variable}")
    is_active = models.BooleanField(default=True)
    usage_count = models.IntegerField(default=0)
    last_used_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "message_templates"
        ordering = ["-usage_count"]


class SentTemplateLog(models.Model):
    """Лог отправленных шаблонов."""
    template = models.ForeignKey(MessageTemplate, on_delete=models.SET_NULL, null=True)
    application = models.ForeignKey('applications.Application', on_delete=models.CASCADE)
    rendered_text = models.TextField()
    sent_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    delivery_status = models.CharField(max_length=20, default="sent")  # sent/delivered/failed

    class Meta:
        db_table = "sent_template_logs"
```

**API:**
```
GET    /api/templates/                   — список шаблонов
POST   /api/templates/                   — создать
PATCH  /api/templates/:id/               — обновить
DELETE /api/templates/:id/               — удалить
POST   /api/templates/:id/render/        — рендер с переменными (превью)
POST   /api/templates/:id/send/          — отправить кандидату через Telegram
POST   /api/templates/:id/send-bulk/     — массовая отправка
GET    /api/templates/variables/          — список доступных переменных
GET    /api/templates/log/               — лог отправок
```

**Отправка:** Celery task → использует существующий `bot.send_message()` из `apps.telegram_bot`.

---

## 6. Фронтенд

```
frontend/src/pages/
└── TemplatesPage.tsx

frontend/src/components/templates/
├── TemplateEditor.tsx          # Textarea с подсветкой переменных
├── TemplatePreview.tsx         # Превью с подставленными значениями
├── VariableChips.tsx           # Кнопки-чипсы для вставки переменных
├── SendTemplateDialog.tsx      # Диалог отправки из карточки кандидата
└── BulkSendDialog.tsx          # Диалог массовой отправки

frontend/src/lib/
└── templates-api.ts
```

**Seed data:** при миграции создать 5–7 базовых шаблонов (резюме отправлено, приглашение на интервью, поздравление с наймом, запрос документов, напоминание).

---

## Приоритеты

### Фаза 1 (4 дня): Модель, CRUD шаблонов, редактор с переменными, превью
### Фаза 2 (3 дня): Отправка через Telegram, кнопка в ApplicationDetailPage, лог отправок
### Фаза 3 (2 дня): Массовая отправка, seed шаблонов
