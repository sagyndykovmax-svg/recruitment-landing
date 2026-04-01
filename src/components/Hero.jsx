import { WhatsAppIcon, SparklesIcon, UsersIcon, ArrowRightIcon, ChevronDownIcon } from './Icons'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-gray-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-300 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm px-4 py-2 rounded-full mb-6 border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Идёт набор — апрель 2026
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Работа за границей<br />
            <span className="text-brand-400">в сфере сервиса и красоты</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-4 max-w-2xl">
            Вакансии в ОАЭ, Саудовской Аравии, Катаре и Кувейте
          </p>
          <p className="text-base text-white/50 mb-10 max-w-2xl">
            Бьюти-мастера и работа с гостями — отели, рестораны, хостес
          </p>

          <p className="text-white/60 text-sm mb-4 uppercase tracking-wider font-semibold">Выберите направление:</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#beauty" className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-400/50 rounded-2xl p-5 transition-all duration-300 flex-1">
              <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                <SparklesIcon className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg group-hover:text-brand-400 transition-colors">Я мастер (бьюти)</span>
                <p className="text-white/50 text-sm mt-1">Ногти, ресницы, волосы</p>
              </div>
            </a>

            <a href="#service" className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-400/50 rounded-2xl p-5 transition-all duration-300 flex-1">
              <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                <UsersIcon className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg group-hover:text-brand-400 transition-colors">Работа с гостями</span>
                <p className="text-white/50 text-sm mt-1">Можно без опыта</p>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#quiz" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
              Оставить заявку
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 border border-white/10">
              <WhatsAppIcon className="w-5 h-5" />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDownIcon className="w-6 h-6 text-white/30" />
      </div>
    </section>
  )
}
