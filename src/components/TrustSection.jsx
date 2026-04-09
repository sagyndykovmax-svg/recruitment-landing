import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useCounter } from '../hooks/useCounter'
import { useLang } from '../i18n'
import { StarIcon } from './Icons'

const reviews = {
  ru: [
    { initials: 'Ж', color: 'bg-brand-200 text-brand-700', name: 'Жазгуль', role: 'Дубай', text: 'Работаю в Дубае уже полгода. Сначала было страшно, но команда Legacy помогла на каждом этапе — от оформления документов до адаптации на месте. Условия хорошие, зарабатываю в несколько раз больше, чем дома.' },
    { initials: 'А', color: 'bg-mint-400/30 text-mint-600', name: 'Азема', role: 'Дубай', text: 'Подруга посоветовала Legacy. Оформили быстро, всё прозрачно. Встретили в аэропорту, заселили. Работодатель адекватный, условия соответствуют тому, что обещали.' },
    { initials: 'М', color: 'bg-purple-200 text-purple-700', name: 'Маргарита', role: 'Дубай', text: 'Уехала работать через Legacy и не пожалела. Контракт понятный, паспорт у меня, координатор на связи. За 4 месяца накопила больше, чем за год дома. Уже продлила контракт.' },
    { initials: 'Ф', color: 'bg-pink-200 text-pink-700', name: 'Феруза', role: 'Дубай', text: 'Долго сомневалась, но решилась. Legacy всё организовали: визу, билеты, жильё. На месте есть русскоязычный координатор, который помогает в любой ситуации. Рекомендую.' },
  ],
  en: [
    { initials: 'Z', color: 'bg-brand-200 text-brand-700', name: 'Zhazgul', role: 'Dubai', text: "I've been working in Dubai for 6 months. I was scared at first, but the Legacy team helped at every step — from paperwork to settling in. Good conditions, I earn several times more than back home." },
    { initials: 'A', color: 'bg-mint-400/30 text-mint-600', name: 'Azema', role: 'Dubai', text: 'A friend recommended Legacy. Everything was processed quickly and transparently. They met me at the airport and helped me settle in. The employer is fair, conditions match what was promised.' },
    { initials: 'M', color: 'bg-purple-200 text-purple-700', name: 'Margarita', role: 'Dubai', text: "I moved through Legacy and don't regret it. Clear contract, passport stays with me, coordinator always available. Saved more in 4 months than in a year back home. Already extended my contract." },
    { initials: 'F', color: 'bg-pink-200 text-pink-700', name: 'Feruza', role: 'Dubai', text: 'I hesitated for a long time but decided to go. Legacy organized everything: visa, tickets, housing. There\'s a Russian-speaking coordinator on-site who helps in any situation. Highly recommend.' },
  ],
}

function Stars() {
  return (
    <div className="flex gap-1 mt-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
  )
}

export default function TrustSection() {
  const ref = useScrollAnimation()
  const { lang, t } = useLang()
  const people = useCounter(350)
  const countries = useCounter(6)
  const years = useCounter(3)

  return (
    <section className="py-20 lg:py-28 bg-white" id="trust">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{t.trust.title}</h2>
        <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl mx-auto">{t.trust.subtitle}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div ref={people.ref} className="text-4xl font-extrabold text-brand-500 mb-2 counter-value">{people.value}+</div>
            <p className="text-gray-500 text-sm">{t.trust.placed}</p>
          </div>
          <div className="text-center">
            <div ref={countries.ref} className="text-4xl font-extrabold text-gray-900 mb-2 counter-value">{countries.value}</div>
            <p className="text-gray-500 text-sm">{t.trust.countries}</p>
          </div>
          <div className="text-center">
            <div ref={years.ref} className="text-4xl font-extrabold text-gray-900 mb-2 counter-value">{years.value}</div>
            <p className="text-gray-500 text-sm">{t.trust.yearsLabel}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">98%</div>
            <p className="text-gray-500 text-sm">{t.trust.satisfaction}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-8 text-center">{t.trust.reviewsTitle}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {reviews[lang].map((r, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${r.color} rounded-full flex items-center justify-center font-bold text-sm`}>{r.initials}</div>
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              <Stars />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
