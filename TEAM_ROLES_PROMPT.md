# Промпт: Модуль «Команда / Роли» для Legacy HR Bot

## Контекст

**Legacy HR Bot** — платформа автоматизации рекрутинга. Полное описание — `PROJECT_CONTEXT.md`. Стек: Django 6.0 + DRF + PostgreSQL. Фронтенд: React 18 + TS + shadcn/ui.

Сейчас один пользователь `admin` с полным доступом. Когда команда вырастет до 3–5 рекрутеров, нужны: разделение доступа, привязка кандидатов к рекрутерам, отслеживание результатов каждого.

---

## Задача

Добавить модуль **«Team / Roles»** — управление пользователями, ролями и разграничение доступа.

---

## Sidebar

```
👥 Team               → /team     (только для admin)
```

В самом низу sidebar, перед Settings.

---

## 1. Роли

| Роль | Описание | Доступ |
|------|----------|--------|
| **Admin** | Полный доступ | Всё: пользователи, настройки, финансы, удаление |
| **Recruiter** | Основной рекрутер | Свои кандидаты/работодатели, все вакансии, шаблоны, документы. НЕ видит: финансы, настройки бота, Team |
| **Viewer** | Только просмотр | Просмотр всех данных. НЕ может: редактировать, удалять, отправлять сообщения |

---

## 2. Привязка данных к рекрутеру

### Что привязывается:

- **Application** → `assigned_to` (ForeignKey к User) — кто ведёт этого кандидата
- **Employer** → `assigned_to` — кто ведёт этого работодателя
- **EmployerVacancy** → наследует от Employer
- **Interview** → `created_by` (уже есть)
- **Invoice** → `created_by` (уже есть)

### Правила видимости (для роли Recruiter):

| Раздел | Что видит |
|--------|----------|
| Applications | Только `assigned_to = me` + неназначенные (`assigned_to = null`) |
| Employers | Только `assigned_to = me` + неназначенные |
| Vacancies | Все (вакансии общие) |
| Interviews | Только свои + те где assigned кандидат |
| Documents | Только своих кандидатов |
| Analytics | Свои метрики (фильтр по assigned_to) |
| Finance | Не видит |
| Team | Не видит |
| Settings | Не видит |
| Templates | Все (шаблоны общие) |

**Admin** видит всё + может фильтровать по рекрутеру.

---

## 3. Страница Team (`/team`)

Доступна только Admin.

### Таблица пользователей:

| Name | Email | Role | Assigned Candidates | Assigned Employers | Last Active | Actions |
|------|-------|------|--------------------|--------------------|-------------|---------|
| Максим С. | max@legacy.com | Admin | — | — | 5 min ago | Edit |
| Алина К. | alina@legacy.com | Recruiter | 42 | 8 | 2h ago | Edit / Deactivate |
| Нурлан М. | nurlan@legacy.com | Recruiter | 38 | 6 | 1d ago | Edit / Deactivate |

Кнопка: **"+ Invite User"**

### Приглашение пользователя (Dialog):

```
Имя: [Input]
Email: [Input]
Роль: [Select: Admin / Recruiter / Viewer]
Telegram Chat ID: [Input — для уведомлений, необязательно]

[Отменить]  [Пригласить]
```

При приглашении → генерируется пароль (или ссылка для установки пароля).

### Редактирование пользователя (Sheet):

- Имя, email, роль
- Telegram Chat ID
- Активен / Деактивирован (Switch)
- Сброс пароля (кнопка)

---

## 4. Назначение рекрутера

### В карточке Application:

Новое поле в header:
```
Assigned to: [Select: Алина К. ▼]  или  [Unassigned — Assign to me]
```

### В карточке Employer:

Аналогично:
```
Assigned to: [Select: Нурлан М. ▼]
```

### Массовое назначение:

В таблице Applications / Employers:
- Выбрать несколько (чекбоксы)
- Bulk action: **"Assign to..."** → Select рекрутера

### Автоматическое назначение (опционально):

При поступлении новой заявки → назначить рекрутеру с наименьшим количеством активных кандидатов (round-robin). Настраивается в Settings: `auto_assign = true/false`.

---

## 5. Фильтр по рекрутеру

Во всех таблицах (Applications, Employers, Interviews) добавить фильтр:

```
Assigned to: [All ▼] / [Алина К.] / [Нурлан М.] / [Unassigned]
```

Для роли Recruiter: фильтр автоматически ставится на "Me" (но можно снять чтобы увидеть неназначенных).

---

## 6. Метрики по рекрутерам (в Analytics)

Новая секция в AnalyticsPage (только для Admin):

**Таблица "Recruiter Performance":**

| Recruiter | Applications | Completed | Sent | Hired | Conversion | Avg Days |
|-----------|-------------|-----------|------|-------|------------|----------|
| Алина К. | 42 | 28 | 15 | 6 | 14.3% | 11 |
| Нурлан М. | 38 | 22 | 12 | 4 | 10.5% | 14 |

---

## 7. Бэкенд

### Изменения (НЕ новое приложение — расширение существующего):

**Новые поля:**
```python
# В модели Application — добавить:
assigned_to = models.ForeignKey('auth.User', on_delete=models.SET_NULL,
                                null=True, blank=True, related_name="assigned_applications")

# В модели Employer — добавить:
assigned_to = models.ForeignKey('auth.User', on_delete=models.SET_NULL,
                                null=True, blank=True, related_name="assigned_employers")

# В модели User (или Profile) — добавить:
# Использовать Django Groups для ролей: "admin", "recruiter", "viewer"
# Или добавить поле role к модели User через AbstractUser / Profile
```

**Подход к ролям — через Django Groups:**
- Создать группы: `admin`, `recruiter`, `viewer`
- Permissions через DRF: кастомный `permission_classes` или middleware
- Фильтрация queryset в ViewSets: `get_queryset()` проверяет роль и `assigned_to`

**Новые API:**
```
GET    /api/team/                    — список пользователей (только admin)
POST   /api/team/                    — создать пользователя
PATCH  /api/team/:id/               — обновить
POST   /api/team/:id/deactivate/    — деактивировать
POST   /api/team/:id/reset-password/ — сброс пароля
GET    /api/team/me/                 — текущий пользователь с ролью

# Assign
POST   /api/applications/:id/assign/          — назначить рекрутера
POST   /api/applications/bulk-assign/          — массовое назначение
POST   /api/employers/:id/assign/              — назначить рекрутера

# Recruiter performance (для analytics)
GET    /api/analytics/recruiters/              — метрики по рекрутерам
```

**Модификация существующих ViewSets:**

В каждом ViewSet добавить фильтрацию:
```python
def get_queryset(self):
    qs = super().get_queryset()
    if self.request.user.groups.filter(name='recruiter').exists():
        qs = qs.filter(
            Q(assigned_to=self.request.user) | Q(assigned_to__isnull=True)
        )
    return qs
```

---

## 8. Фронтенд

```
frontend/src/pages/
└── TeamPage.tsx                    # Список пользователей (только admin)

frontend/src/components/team/
├── InviteUserDialog.tsx
├── EditUserSheet.tsx
├── AssignRecruiterSelect.tsx       # Select для назначения в карточках
├── RecruiterFilter.tsx             # Фильтр по рекрутеру в таблицах
└── RecruiterPerformanceTable.tsx   # Таблица для Analytics

frontend/src/lib/
└── team-api.ts
```

**Также:** добавить проверку роли в sidebar — скрывать пункты Finance, Team, Settings для Recruiter/Viewer.

Хранить роль текущего пользователя в контексте (React Context) после `/api/team/me/`.

---

## Приоритеты

### Фаза 1 (1 неделя): Django Groups, assigned_to поля, фильтрация queryset, TeamPage, CRUD пользователей
### Фаза 2 (3 дня): AssignRecruiterSelect в карточках, bulk assign, RecruiterFilter
### Фаза 3 (2 дня): Sidebar permission-based rendering, RecruiterPerformance в Analytics, auto-assign

---

## Важные правила

1. **Использовать Django Groups** для ролей (не кастомное поле) — это стандартный Django-паттерн
2. **Фильтрация в get_queryset()** — НЕ в template/frontend (безопасность)
3. **Admin видит всё** — никаких ограничений
4. **Recruiter видит своё + неназначенное** — чтобы мог "подхватить" нового кандидата
5. **Viewer не может ничего менять** — все POST/PATCH/DELETE возвращают 403
6. **НЕ создавать новое Django-приложение** — расширить `apps.recruiters` (views, urls) + миграции для assigned_to в existing models
