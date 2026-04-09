import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SparklesIcon, CheckIcon, MoneyIcon, GlobeIcon, RocketIcon, ArrowRightIcon } from './Icons'

export default function BeautySection() {
  const ref = useScrollAnimation()

  return (
    <section className="py-20 lg:py-28 bg-white border-t-4 border-brand-300" id="beauty">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Бьюти-сфера</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Для мастеров красоты</h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl">
          Нейл-мастера, лешмейкеры, парикмахеры — ваши навыки востребованы в премиальных салонах Ближнего Востока
        </p>

        {/* Conditions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            { value: '$1 500–3 000', label: 'Зарплата в месяц, зависит от квалификации и страны', color: 'text-brand-500' },
            { value: 'Жильё', label: 'Предоставляется работодателем, отдельная комната или квартира', color: 'text-dark-800' },
            { value: '6/1', label: 'Стандартный график, 8-часовой рабочий день', color: 'text-dark-800' },
            { value: 'Контракт', label: 'Официальное трудоустройство, рабочая виза, страховка', color: 'text-dark-800' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className={`text-3xl font-bold ${item.color} mb-2`}>{item.value}</div>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-gradient-to-r from-brand-50 to-white border border-brand-100 rounded-2xl p-8 mb-16">
          <h3 className="text-xl font-bold mb-6">Требования</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {['Опыт работы от 1 года', 'Портфолио работ (фото)', 'Загранпаспорт (или готовность оформить)', 'Желание работать и зарабатывать'].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <h3 className="text-xl font-bold mb-6">Почему мастера выбирают работу за границей</h3>
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <MoneyIcon className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', title: 'Доход в 3–5 раз выше', desc: 'При тех же навыках вы зарабатываете значительно больше' },
            { icon: <GlobeIcon className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Международный опыт', desc: 'Работа с клиентами из разных стран, рост навыков' },
            { icon: <RocketIcon className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: 'Карьерный рост', desc: 'Возможность остаться, открыть своё дело или вырасти до управляющего' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>{item.icon}</div>
              <div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="#quiz" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
            Оставить заявку
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
