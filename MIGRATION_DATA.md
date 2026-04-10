# Данные для миграции с legacygroup.work

**Дата снятия данных:** 2026-04-09
**Старый домен:** legacygroup.work
**Новый домен:** (определить при миграции)

---

## 1. Трекинг и аналитика

### Google Tag Manager
```
ID: GTM-5JMXT9R
```
Подключить в `<head>` нового сайта:
```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JMXT9R');</script>
```

### Facebook Pixel
```
ID: 3299001670389291
```
Подключить:
```html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '3299001670389291');
fbq('track', 'PageView');
</script>
```

### Google Analytics
```
Не обнаружен отдельный GA ID — вероятно настроен через GTM.
Проверить в GTM-панели: https://tagmanager.google.com
Контейнер: GTM-5JMXT9R
```

### Yandex Metrika
```
Не обнаружен. Рекомендуется подключить при миграции.
```

---

## 2. robots.txt

```
User-agent: *
Host: https://legacygroup.work
Sitemap: https://legacygroup.work/sitemap.xml
Disallow: /confidential
Disallow: /en/confidential
Allow: /
```

**При миграции заменить:**
```
User-agent: *
Host: https://NEW_DOMAIN
Sitemap: https://NEW_DOMAIN/sitemap.xml
Disallow: /confidential
Allow: /
```

---

## 3. Sitemap — все 41 URL (для 301-редиректов)

### Русская версия (20 URL):

| Старый URL | Приоритет | Новый URL (предложение) |
|---|---|---|
| / | 1.00 | / |
| /about-legacy-group | 0.80 | /about |
| /blog | 0.80 | /blog |
| /blog/rabota-za-rubezhom-dlya-par | 0.60 | /blog/work-abroad-for-couples |
| /blog/trendy | 0.60 | /blog/trends |
| /faq | 0.80 | /#faq |
| /for-employer | 0.80 | /employers |
| /for-employer/uae | 0.60 | /employers?country=uae |
| /for-employer/kuwait | 0.60 | /employers?country=kuwait |
| /for-employer/qatar | 0.60 | /employers?country=qatar |
| /for-employer/saudi-arabia | 0.60 | /employers?country=sa |
| /for-employer/bahrain | 0.60 | /employers?country=bahrain |
| /for-employer/oman | 0.60 | /employers?country=oman |
| /vacancy | 0.80 | /jobs |
| /vacancy/uae | 0.60 | /jobs?country=uae |
| /vacancy/kuwait | 0.60 | /jobs?country=kuwait |
| /vacancy/qatar | 0.60 | /jobs?country=qatar |
| /vacancy/saudi-arabia | 0.60 | /jobs?country=sa |
| /vacancy/bahrain | 0.60 | /jobs?country=bahrain |
| /vacancy/oman | 0.60 | /jobs?country=oman |

### Английская версия (21 URL):

| Старый URL | Приоритет | Новый URL (предложение) |
|---|---|---|
| /en | 1.00 | /en |
| /en/about-legacy-group | 0.80 | /en/about |
| /en/blog | 0.80 | /en/blog |
| /en/blog/employment-rules-for-couples | 0.60 | /en/blog/work-abroad-for-couples |
| /en/blog/trends | 0.60 | /en/blog/trends |
| /en/faq | 0.80 | /en/#faq |
| /en/for-employer | 0.80 | /en/employers |
| /en/for-employer/uae | 0.60 | /en/employers?country=uae |
| /en/for-employer/kuwait | 0.60 | /en/employers?country=kuwait |
| /en/for-employer/qatar | 0.60 | /en/employers?country=qatar |
| /en/for-employer/saudi-arabia | 0.60 | /en/employers?country=sa |
| /en/for-employer/bahrain | 0.60 | /en/employers?country=bahrain |
| /en/for-employer/oman | 0.60 | /en/employers?country=oman |
| /en/vacancy | 0.80 | /en/jobs |
| /en/vacancy/uae | 0.60 | /en/jobs?country=uae |
| /en/vacancy/kuwait | 0.60 | /en/jobs?country=kuwait |
| /en/vacancy/qatar | 0.60 | /en/jobs?country=qatar |
| /en/vacancy/saudi-arabia | 0.60 | /en/jobs?country=sa |
| /en/vacancy/bahrain | 0.60 | /en/jobs?country=bahrain |
| /en/vacancy/oman | 0.60 | /en/jobs?country=oman |

---

## 4. JSON-LD структурированные данные

```json
{
  "@context": "http://schema.org/",
  "@type": "LocalBusiness",
  "name": "Legacy",
  "url": "https://legacygroup.work",
  "logo": "https://legacygroup.work/assets/img/logo.svg",
  "description": "Работа за рубежом для граждан кыргызстана: ОАЭ (Дубай, Абу-Даби), Катар, Кувейт, Оман, Бахрейн, Саудовская Аравия. С нами вы найдете работу в мировых компаниях!",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Киевская 107, 515 каб",
    "addressLocality": "Бишкек",
    "addressCountry": "Кыргызстан"
  },
  "hasMap": "https://g.co/kgs/5hRCAz",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+996 707 60 55 75"
  },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Есть ли вакансии без английского?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "На данный момент только в салоны красоты. Чем лучше английский, тем больше открываются вариантов вакансий в арабские страны"
      }
    },
    {
      "@type": "Question",
      "name": "На сколько заключается контракт?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Контракт заключается на 2 года. Предоставляется месячный отпуск домой после года работы"
      }
    },
    {
      "@type": "Question",
      "name": "Что требуется для регистрации?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1. Пройти консультацию у наших специалистов. 2. Заполнить резюме на нашем сайте в случае необходимости. 3. Предоставить сертификаты, портфолио работ в случае необходимости"
      }
    },
    {
      "@type": "Question",
      "name": "Когда будет собеседование?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "В зависимости от требований работодателя и ваших данных онлайн собеседование можно устроить в течение недели"
      }
    }
  ]
}
```

---

## 5. Контакты и соцсети (подтверждённые)

| Канал | Значение |
|---|---|
| Телефон / WhatsApp | +996 707 60 55 75 |
| Email | cv@legacygroup.work |
| Telegram (личный) | @datamanager312 |
| Telegram (канал) | @legacy_kg |
| Instagram | instagram.com/legacy.work.kg |
| Адрес | г. Бишкек, ул. Киевская 107, каб. 515 |
| Режим работы | пн–пт, 10:00–18:00 |
| Google Maps | https://g.co/kgs/5hRCAz |

---

## 6. Чеклист миграции

При переносе нового сайта на домен legacygroup.work:

```
☐ 1. Настроить 301-редиректы для всех 41 URL (таблица выше)
☐ 2. Подключить GTM (GTM-5JMXT9R) в <head> нового сайта
☐ 3. Подключить Facebook Pixel (3299001670389291)
☐ 4. Подключить Yandex Metrika (создать новый счётчик)
☐ 5. Обновить robots.txt (новый домен/хост)
☐ 6. Сгенерировать новый sitemap.xml
☐ 7. Обновить JSON-LD (url, logo на новый домен)
☐ 8. Добавить Google Search Console верификацию
☐ 9. Добавить Yandex Webmaster верификацию
☐ 10. Обновить DNS записи
☐ 11. Установить SSL сертификат
☐ 12. Пропинговать Google и Yandex о новом sitemap
☐ 13. Проверить индексацию через 1 неделю
☐ 14. Мониторить 404 ошибки первые 2 недели
☐ 15. Обновить ссылки в соцсетях и Telegram
```

---

## 7. Что НЕ было на старом сайте (добавить при миграции)

- Meta title / description для каждой страницы
- Open Graph теги (og:title, og:description, og:image)
- Canonical URLs
- Hreflang теги (RU/EN)
- Alt тексты на изображениях
- Yandex Metrika
- Google Search Console верификация
