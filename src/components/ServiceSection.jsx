import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { UsersIcon, CheckIcon, ArrowRightIcon } from './Icons'

const positions = [
  { emoji: '🏨', title: 'Хостес', desc: 'Встреча гостей, координация посадки, коммуникация с командой' },
  { emoji: '🍽️', title: 'Официант', desc: 'Обслуживание гостей в ресторанах и лаунжах премиум-класса' },
  { emoji: '🛎️', title: 'Ресепшн', desc: 'Регистрация, приём звонков, работа с запросами' },
  { emoji: '📋', title: 'Администратор', desc: 'Управление процессами, контроль качества сервиса' },
]

const conditions = [
  { value: '$800–1 800', label: 'Зарплата + чаевые, зависит от позиции и страны', color: 'text-mint-600' },
  { value: 'Жильё + питание', label: 'Предоставляется работодателем', color: 'text-dark-800' },
  { value: 'Без опыта', label: 'Обучение на месте, достаточно базовых навыков общения', color: 'text-dark-800' },
  { value: 'Контракт', label: 'Официальное оформление, виза, медицинская страховка', color: 'text-dark-800' },
]

const requirements = [
  'Возраст 18–30 лет',
  'Ухоженный внешний вид',
  'Базовый английский (приветствуется, но не обязателен)',
  'Загранпаспорт (или готовность оформить)',
]

export default function ServiceSection() {
  const ref = useScrollAnimation()

  return (
    <section className="py-20 lg:py-28 bg-gray-50 border-t-4 border-mint-400" id="service">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-mint-400/15 rounded-xl flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-mint-600" />
          </div>
          <span className="text-mint-600 font-semibold text-sm uppercase tracking-wider">Сфера сервиса</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Работа с гостями</h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl">
          Отели, рестораны, лаунжи — позиции, где главное умение общаться с людьми. Подходит без узкой специальности
        </p>

        {/* Positions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {positions.map((pos, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-mint-400/30 hover:shadow-md transition-all">
              <div className="text-2xl mb-3">{pos.emoji}</div>
              <h4 className="font-semibold mb-1">{pos.title}</h4>
              <p className="text-gray-500 text-sm">{pos.desc}</p>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {conditions.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className={`text-3xl font-bold ${item.color} mb-2`}>{item.value}</div>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-gradient-to-r from-mint-400/10 to-white border border-mint-400/20 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold mb-6">Требования</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-mint-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="#quiz" className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-mint-500/25">
            Оставить заявку
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
