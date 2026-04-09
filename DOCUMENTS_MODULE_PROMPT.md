# Промпт: Модуль «Документооборот» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO. Фронтенд: React 18 + TS + shadcn/ui.

При трудоустройстве за рубеж у каждого кандидата есть набор документов: загранпаспорт, виза, медосмотр, контракт, билеты. Сейчас это отслеживается вне системы (чаты, таблицы, голова рекрутера). Нужно перенести в дашборд.

---

## Задача

Добавить модуль **«Documents»** — отслеживание документов кандидатов на каждом этапе трудоустройства.

---

## Sidebar

```
📄 Documents          → /documents
```

Между Candidates и Employers.

---

## 1. Чеклист документов кандидата

Каждый кандидат со статусом SHORTLISTED и выше получает чеклист обязательных документов.

### Типы документов:

| Документ | Обязательный | Может иметь срок |
|----------|-------------|-------------------|
| Загранпаспорт (International Passport) | Да | Да (expiry date) |
| Виза (Work Visa) | Да | Да |
| Медосмотр (Medical Examination) | Да | Да |
| Контракт (Employment Contract) | Да | Нет |
| Авиабилеты (Flight Tickets) | Да | Да (flight date) |
| Фото для визы (Visa Photo) | По категории | Нет |
| Нотариальный перевод (Notarized Translation) | По стране | Нет |
| Страховка (Insurance) | По работодателю | Да |

### Статусы документа:

| Статус | Badge | Описание |
|--------|-------|----------|
| Not Started | ⚪ Серый | Ещё не начато |
| In Progress | 🔵 Синий | В процессе оформления |
| Uploaded | 🟡 Жёлтый | Файл загружен, ждёт проверки |
| Approved | 🟢 Зелёный | Проверен, всё ок |
| Rejected | 🔴 Красный | Проблема (истёк, плохое качество) |
| Expired | 🟠 Оранжевый | Срок истёк |

---

## 2. Страница Documents (`/documents`)

### Общий вид — таблица кандидатов с прогрессом документов

**Toolbar:**
- Поиск по имени кандидата
- Фильтры: статус кандидата (Shortlisted/Hired), страна назначения, прогресс документов (All / Incomplete / Complete)
- Кнопка: "Export CSV"

**Таблица:**

| Candidate | Destination | Status | Progress | Passport | Visa | Medical | Contract | Flight | Actions |
|-----------|-------------|--------|----------|----------|------|---------|----------|--------|---------|
| Айгуль К. | UAE | Shortlisted | 4/6 ✅ | ✅ | 🔵 | ✅ | ✅ | ⚪ | View |
| Дмитрий М. | Qatar | Hired | 6/6 ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | View |
| Марина С. | Saudi Arabia | Shortlisted | 2/6 | ✅ | ⚪ | 🔵 | ⚪ | ⚪ | View |

- Progress: `X/Y` с прогресс-баром
- Каждый документ — иконка статуса (цветной кружок)
- Строки с Expired документами подсвечиваются красным

---

## 3. Карточка документов кандидата (`/documents/:applicationId`)

**Или: встроить как таб в существующую страницу `/applications/:id`** — таб "Documents" рядом с "Messages", "Media" и т.д.

### Верхняя часть:
```
📄 Документы — Айгуль К.
Направление: UAE, Dubai | Работодатель: Al Barsha Salon
Общий прогресс: ████████░░ 4/6 (67%)
```

### Список документов (карточки):

```
┌──────────────────────────────────────────────┐
│  🛂 Загранпаспорт                    ✅ Approved │
│  Номер: 75 1234567                           │
│  Срок: до 15.03.2030                        │
│  Файл: passport_scan.pdf  [👁 View] [⬇ Download] │
│  Загружен: 20.03.2026                        │
│  Проверил: admin, 21.03.2026                 │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  🏥 Медосмотр                       🔵 In Progress │
│  Срок: —                                     │
│  Файл: не загружен                           │
│  Заметка: "Записана на 05.04.2026"           │
│                                              │
│  [📎 Upload]  [✏️ Edit]                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ✈️ Авиабилеты                       ⚪ Not Started │
│  Дата вылета: —                              │
│  Файл: не загружен                           │
│                                              │
│  [📎 Upload]  [✏️ Edit]                       │
└──────────────────────────────────────────────┘
```

### Для каждого документа — форма редактирования (Sheet):
- Статус (Select)
- Номер документа (текст, необязательно)
- Дата выдачи / срок действия (DatePicker)
- Файл (Upload → MinIO)
- Заметка рекрутера (Textarea)

---

## 4. Уведомления и напоминания

Через Celery Beat + существующий Telegram-бот:

| Событие | Когда | Сообщение |
|---------|-------|-----------|
| Документ истекает | За 30 дней до expiry | `⚠️ Паспорт Айгуль К. истекает 15.04.2026 (через 30 дней)` |
| Документ истёк | В день expiry | `🔴 Паспорт Айгуль К. истёк! Требуется обновление.` |
| Документы неполные | Каждый понедельник | `📄 3 кандидата с неполными документами: Айгуль К. (4/6), Марина С. (2/6)` |
| Все документы готовы | При 100% | `✅ Все документы Айгуль К. готовы. Можно оформлять вылет.` |

---

## 5. Бэкенд

### Django-приложение: `backend/apps/documents/`

```
backend/apps/documents/
├── models.py          # DocumentType, CandidateDocument
├── serializers.py
├── views.py
├── urls.py
├── tasks.py           # Celery: проверка сроков, напоминания
├── services/
│   └── checklist.py   # Генерация чеклиста по категории/стране
└── migrations/
```

### Модели

```python
class DocumentType(models.Model):
    """Тип документа (загранпаспорт, виза, медосмотр...)"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_required = models.BooleanField(default=True)
    has_expiry = models.BooleanField(default=False)
    category_filter = models.CharField(max_length=50, blank=True,
        help_text="Обязателен только для этой категории (beauty/hospitality), пусто = для всех")
    country_filter = models.CharField(max_length=100, blank=True,
        help_text="Обязателен только для этой страны, пусто = для всех")
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = "document_types"
        ordering = ["sort_order"]


class CandidateDocument(models.Model):
    """Конкретный документ конкретного кандидата."""
    STATUS_CHOICES = [
        ("not_started", "Not Started"),
        ("in_progress", "In Progress"),
        ("uploaded", "Uploaded"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("expired", "Expired"),
    ]

    application = models.ForeignKey('applications.Application',
                                     on_delete=models.CASCADE,
                                     related_name="documents")
    document_type = models.ForeignKey(DocumentType, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                              default="not_started")
    document_number = models.CharField(max_length=100, blank=True)
    issued_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    file_storage_key = models.CharField(max_length=255, blank=True,
                                        help_text="Ключ файла в MinIO")
    file_name = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL,
                                    null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "candidate_documents"
        unique_together = ["application", "document_type"]
        ordering = ["document_type__sort_order"]
```

### API

```
GET    /api/documents/                          — таблица кандидатов с прогрессом
GET    /api/documents/:applicationId/           — чеклист документов кандидата
POST   /api/documents/:applicationId/           — создать запись документа
PATCH  /api/documents/:applicationId/:docId/    — обновить статус/данные
POST   /api/documents/:applicationId/:docId/upload/  — загрузить файл в MinIO
GET    /api/documents/:applicationId/:docId/download/ — presigned URL для скачивания
POST   /api/documents/:applicationId/generate-checklist/ — сгенерировать чеклист по категории/стране
GET    /api/documents/expiring/                 — документы с истекающим сроком
```

### Celery Beat

```python
'documents-check-expiry': {
    'task': 'apps.documents.tasks.check_expiring_documents',
    'schedule': crontab(hour=8, minute=0),  # Каждый день 08:00
},
'documents-weekly-summary': {
    'task': 'apps.documents.tasks.send_incomplete_documents_summary',
    'schedule': crontab(hour=9, minute=0, day_of_week=1),  # Пн 09:00
},
```

---

## 6. Фронтенд

```
frontend/src/
├── pages/
│   ├── DocumentsPage.tsx              # Таблица кандидатов с прогрессом
│   └── CandidateDocumentsPage.tsx     # Чеклист документов кандидата
├── components/documents/
│   ├── DocumentProgress.tsx           # Прогресс-бар X/Y
│   ├── DocumentStatusIcon.tsx         # Цветной кружок статуса
│   ├── DocumentCard.tsx               # Карточка одного документа
│   ├── DocumentEditSheet.tsx          # Sheet редактирования
│   └── DocumentUpload.tsx             # Загрузка файла в MinIO
└── lib/
    └── documents-api.ts
```

---

## Приоритеты

### Фаза 1 (1 неделя): DocumentType + CandidateDocument модели, CRUD API, таблица с прогрессом, чеклист кандидата
### Фаза 2 (3 дня): Upload в MinIO, просмотр/скачивание файлов, авто-генерация чеклиста
### Фаза 3 (2 дня): Celery: проверка сроков, Telegram-напоминания

---

## Важные правила

1. Файлы хранить в **MinIO** (bucket `recruitment-media`, ключ `documents/{app_id}/{doc_type}/{uuid}.{ext}`)
2. **Presigned URLs** для скачивания (как у фото — 7 дней TTL)
3. При смене статуса Application на SHORTLISTED → **автоматически генерировать чеклист** (Celery task)
4. DocumentType — seed data (заполнить при миграции)
5. **Встроить таб "Documents"** в существующую страницу ApplicationDetailPage (не только отдельная страница)
