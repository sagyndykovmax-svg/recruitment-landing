# Промпт: Модуль «Финансы / Invoicing» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + Celery + PostgreSQL + Redis + MinIO. Фронтенд: React 18 + TS + shadcn/ui.

Агентство зарабатывает на комиссии с каждого трудоустроенного кандидата. Работодатель платит за найм. Сейчас финансы отслеживаются вне системы. Нужно отслеживать доход, долги, выставлять счета.

---

## Задача

Добавить модуль **«Finance»** — учёт платежей от работодателей за трудоустройство кандидатов.

---

## Sidebar

```
💰 Finance            → /finance
```

---

## 1. Страница Finance (`/finance`)

### Верхние карточки (KPI):

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  💰 $14,200   │ │  📤 $8,500    │ │  ✅ $5,700    │ │  🔴 $3,200    │
│  Общий доход │ │  Выставлено  │ │  Оплачено    │ │  Задолженность│
│  (этот месяц)│ │  счетов      │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Tabs:

**Tab "Invoices" (Счета):**

Таблица:

| # | Employer | Candidate | Position | Amount | Status | Due Date | Actions |
|---|----------|-----------|----------|--------|--------|----------|---------|
| INV-001 | Al Barsha Salon | Айгуль К. | Nail Master | $1,200 | ✅ Paid | 15.03.2026 | View |
| INV-002 | Royal Hotel | Дмитрий М. | Waiter | $800 | 🟡 Sent | 01.04.2026 | View |
| INV-003 | Al Barsha Salon | Марина С. | Hair Stylist | $1,200 | 🔴 Overdue | 20.03.2026 | View |

- Status: Draft (серый) → Sent (жёлтый) → Paid (зелёный) / Overdue (красный) / Cancelled (перечёркнутый)
- Кнопка: **"+ Create Invoice"**
- Фильтры: статус, работодатель, период

**Tab "By Employer" (По работодателям):**

| Employer | Total Invoiced | Paid | Outstanding | Candidates Hired |
|----------|---------------|------|-------------|-----------------|
| Al Barsha Salon | $4,800 | $3,600 | $1,200 | 4 |
| Royal Hotel | $2,400 | $1,600 | $800 | 3 |

**Tab "Revenue Chart" (График дохода):**

- BarChart: доход по месяцам (Paid invoices)
- Линия: количество наймов

---

## 2. Создание счёта

При нажатии **"+ Create Invoice"** или автоматически при `CandidateSubmission.employer_response = 'hired'`:

**Диалог/страница:**
```
Работодатель: [Select — из списка Employers]
Кандидат: [Select — из нанятых кандидатов этого работодателя]
Вакансия: [автоматически по кандидату]

Сумма: [Input число] [Select валюта: USD/AED/SAR]
Описание: [Textarea — необязательно]
Дата выставления: [DatePicker — сегодня по умолчанию]
Срок оплаты: [DatePicker — +14 дней по умолчанию]

[Сохранить как черновик]  [Выставить счёт]
```

---

## 3. Карточка счёта (`/finance/invoices/:id`)

```
┌─────────────────────────────────────────────┐
│  Invoice #INV-001                           │
│  Status: ✅ Paid  [Change Status ▼]         │
│                                             │
│  Работодатель: Al Barsha Beauty Salon       │
│  Кандидат: Айгуль К. → Nail Master          │
│                                             │
│  Сумма: $1,200 USD                          │
│  Выставлен: 01.03.2026                      │
│  Срок оплаты: 15.03.2026                    │
│  Оплачен: 12.03.2026                        │
│                                             │
│  [✏️ Edit]  [📄 Download PDF]  [🗑 Delete]   │
└─────────────────────────────────────────────┘
```

---

## 4. Автоматика

- При `CandidateSubmission.employer_response = 'hired'` → автоматически создавать **черновик** счёта (Draft)
- Celery: ежедневно проверять Sent invoices → если past due date → статус Overdue
- Telegram: уведомление рекрутеру о просроченных счетах (`🔴 Счёт INV-003 просрочен: Al Barsha Salon, $1,200`)

---

## 5. Бэкенд

### `backend/apps/finance/`

**Модели:**
```python
class Invoice(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("cancelled", "Cancelled"),
    ]

    invoice_number = models.CharField(max_length=20, unique=True)  # auto: INV-0001
    employer = models.ForeignKey('employers.Employer', on_delete=models.CASCADE,
                                 related_name="invoices")
    submission = models.ForeignKey('employers.CandidateSubmission',
                                   on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=5, default="USD")
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    issued_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "invoices"
        ordering = ["-issued_date"]
```

**API:**
```
GET    /api/finance/invoices/             — список счетов (фильтры)
POST   /api/finance/invoices/             — создать счёт
GET    /api/finance/invoices/:id/         — детали
PATCH  /api/finance/invoices/:id/         — обновить
DELETE /api/finance/invoices/:id/         — удалить (только draft)
GET    /api/finance/summary/              — KPI карточки
GET    /api/finance/by-employer/          — агрегация по работодателям
GET    /api/finance/revenue-chart/        — данные для графика дохода
```

**Celery Beat:**
```python
'finance-check-overdue': {
    'task': 'apps.finance.tasks.check_overdue_invoices',
    'schedule': crontab(hour=9, minute=0),  # Каждый день 09:00
},
```

---

## 6. Фронтенд

```
frontend/src/pages/finance/
├── FinancePage.tsx           # KPI + Tabs (Invoices, By Employer, Revenue)
├── InvoiceDetailPage.tsx     # Карточка счёта
└── CreateInvoiceDialog.tsx   # Диалог создания

frontend/src/components/finance/
├── InvoiceStatusBadge.tsx
├── RevenueChart.tsx          # BarChart (Recharts)
└── EmployerBalanceTable.tsx

frontend/src/lib/
└── finance-api.ts
```

---

## Приоритеты

### Фаза 1 (1 неделя): Invoice модель, CRUD, таблица счетов, создание, KPI
### Фаза 2 (3 дня): Авто-создание при hired, проверка overdue, Telegram-уведомления
### Фаза 3 (2 дня): Revenue chart, агрегация по работодателям, Download PDF
