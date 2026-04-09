import { ArrowRightIcon, CheckIcon } from '../components/Icons'

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">О компании Legacy</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Профессиональный подбор и обучение специалистов для работы за рубежом. Мы помогаем людям изменить свою жизнь через достойное трудоустройство.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Мы создаём мост между талантливыми специалистами из СНГ и работодателями на Ближнем Востоке. Наша задача — сделать трудоустройство за рубежом прозрачным, безопасным и доступным.
              </p>
              <p className="text-gray-600 leading-relaxed">
                За 3 года работы мы трудоустроили более 350 человек в 6 странах: ОАЭ, Саудовская Аравия, Катар, Кувейт, Оман и Бахрейн.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Почему нам доверяют</h2>
              <div className="space-y-3">
                {[
                  'Официальное оформление по контракту',
                  'Подготовка к интервью с работодателем',
                  'Прозрачные условия — без скрытых платежей',
                  'Координатор на месте 24/7',
                  'Поддержка на весь период контракта',
                  'Помощь с документами, визой и перелётом',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Legacy в цифрах</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '350+', label: 'Людей трудоустроено' },
              { value: '6', label: 'Стран' },
              { value: '3 года', label: 'На рынке' },
              { value: '98%', label: 'Довольны условиями' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-brand-500 mb-2">{stat.value}</div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Наш офис</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Адрес</p>
                <p className="text-gray-500 text-sm">г. Бишкек, ул. Киевская 107, каб. 515</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Режим работы</p>
                <p className="text-gray-500 text-sm">пн–пт, 10:00–18:00</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Телефон</p>
                <a href="tel:+996707605575" className="text-brand-500 text-sm hover:text-brand-600">+996 707 60 55 75</a>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Email</p>
                <a href="mailto:cv@legacygroup.work" className="text-brand-500 text-sm hover:text-brand-600">cv@legacygroup.work</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-50 via-brand-100/50 to-mint-400/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-gray-500 mb-8">Заполните короткую анкету — мы подберём подходящую вакансию</p>
          <a href="/#quiz" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
            Оставить заявку
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  )
}
