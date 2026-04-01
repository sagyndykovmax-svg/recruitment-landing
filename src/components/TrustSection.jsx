import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useCounter } from '../hooks/useCounter'
import { StarIcon } from './Icons'

const reviews = [
  {
    initials: 'АК', color: 'bg-brand-200 text-brand-700',
    name: 'Айгуль К.', role: 'Нейл-мастер, Дубай',
    text: 'Переехала 8 месяцев назад. Сначала боялась, что обманут. Но всё прошло чётко: встретили, заселили, на следующий день уже была в салоне. Зарабатываю в 4 раза больше, чем дома.',
  },
  {
    initials: 'ДМ', color: 'bg-blue-200 text-blue-700',
    name: 'Дмитрий М.', role: 'Официант, Катар',
    text: 'Не было опыта вообще. Прошёл обучение на месте за неделю. Сейчас работаю в 5-звёздочном отеле. Чаевые — отдельная история. За 4 месяца накопил больше, чем за год дома.',
  },
  {
    initials: 'МС', color: 'bg-green-200 text-green-700',
    name: 'Марина С.', role: 'Лешмейкер, Эр-Рияд',
    text: 'Подруга уехала первая, потом позвала меня. Оформили быстро — за 3 недели. Условия хорошие, клиенты щедрые. Уже продлила контракт на второй год.',
  },
]

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
  const people = useCounter(350)
  const countries = useCounter(4)
  const years = useCounter(3)

  return (
    <section className="py-20 lg:py-28 bg-white" id="trust">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Это реально работает</h2>
        <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl mx-auto">
          Мы не обещаем — мы показываем результаты. Каждый кейс — реальный человек, который уже работает за границей
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div ref={people.ref} className="text-4xl font-extrabold text-brand-500 mb-2 counter-value">{people.value}+</div>
            <p className="text-gray-500 text-sm">Людей трудоустроено</p>
          </div>
          <div className="text-center">
            <div ref={countries.ref} className="text-4xl font-extrabold text-dark-800 mb-2 counter-value">{countries.value}</div>
            <p className="text-gray-500 text-sm">Страны трудоустройства</p>
          </div>
          <div className="text-center">
            <div ref={years.ref} className="text-4xl font-extrabold text-dark-800 mb-2 counter-value">{years.value}</div>
            <p className="text-gray-500 text-sm">Года на рынке</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-dark-800 mb-2">98%</div>
            <p className="text-gray-500 text-sm">Довольны условиями</p>
          </div>
        </div>

        {/* Reviews */}
        <h3 className="text-xl font-bold mb-8 text-center">Отзывы наших кандидатов</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
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
