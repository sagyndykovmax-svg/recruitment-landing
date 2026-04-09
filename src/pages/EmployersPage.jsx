import { useState } from 'react'
import { ArrowRightIcon, CheckIcon } from '../components/Icons'

export default function EmployersPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-mint-400/10 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">Для работодателей</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Мы подбираем проверенных специалистов для вашего бизнеса в сфере красоты и гостеприимства. Быстро, надёжно, с гарантией.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Что мы предлагаем</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Подбор персонала', desc: 'Нейл-мастера, парикмахеры, лешмейкеры, хостес, официанты, администраторы' },
              { title: 'Проверенные кандидаты', desc: 'Каждый кандидат проходит анкетирование, проверку портфолио и интервью' },
              { title: 'Подготовка к работе', desc: 'Обучение стандартам сервиса, языковая подготовка, культурная адаптация' },
              { title: 'Оформление документов', desc: 'Помогаем с визой, медосмотром, контрактом и перелётом' },
              { title: 'Замена кандидата', desc: 'Если кандидат не подошёл — подберём замену без дополнительных затрат' },
              { title: 'Постоянная поддержка', desc: 'Координатор на месте решает вопросы адаптации и коммуникации' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Как мы работаем</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Заявка', desc: 'Вы описываете позицию, требования и условия' },
              { num: '2', title: 'Подбор', desc: 'Мы подбираем подходящих кандидатов из базы' },
              { num: '3', title: 'Интервью', desc: 'Вы проводите интервью и выбираете кандидата' },
              { num: '4', title: 'Оформление', desc: 'Мы оформляем документы и организуем приезд' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-mint-500 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-3">{s.num}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white" id="employer-form">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-center mb-2">Оставить заявку</h2>
            <p className="text-gray-500 text-center mb-8">Мы свяжемся в течение 24 часов</p>

            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                <input type="text" placeholder="Название компании" required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Страна" required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                  <input type="text" placeholder="Город" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                </div>
                <input type="text" placeholder="Контактное лицо" required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <input type="tel" placeholder="WhatsApp / телефон" required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <input type="text" placeholder="Какие специалисты нужны?" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <textarea placeholder="Дополнительная информация" rows={3} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white resize-none" />
                <button type="submit" className="w-full bg-mint-500 hover:bg-mint-600 text-white font-semibold py-4 rounded-xl text-lg transition-all">
                  Отправить заявку
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-gray-500">Мы свяжемся с вами в течение 24 часов.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
