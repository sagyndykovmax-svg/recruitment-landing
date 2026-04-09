import { WhatsAppIcon, SparklesIcon, UsersIcon, ArrowRightIcon, ChevronDownIcon } from './Icons'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white" id="hero">
      {/* Soft decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-mint-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm px-4 py-2 rounded-full mb-6 border border-brand-200">
            <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse" />
            350+ людей уже трудоустроены
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Работа за границей<br />
            <span className="text-brand-500">в сфере сервиса и красоты</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl">
            Вакансии в ОАЭ, Саудовской Аравии, Катаре, Кувейте, Омане и Бахрейне
          </p>
          <p className="text-base text-gray-400 mb-6 max-w-2xl">
            Бьюти-мастера и работа с гостями — отели, рестораны, хостес
          </p>

          {/* Social proof chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm text-sm">
              <span className="font-bold text-brand-500">350+</span>
              <span className="text-gray-500">трудоустроены</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm text-sm">
              <span className="font-bold text-mint-600">6</span>
              <span className="text-gray-500">стран</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm text-sm">
              <span className="font-bold text-gray-900">3 года</span>
              <span className="text-gray-500">на рынке</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-semibold">Выберите направление:</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#beauty" className="group flex items-center gap-4 bg-white hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-2xl p-5 transition-all duration-300 flex-1 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                <SparklesIcon className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <span className="text-gray-900 font-semibold text-lg group-hover:text-brand-600 transition-colors">Я мастер (бьюти)</span>
                <p className="text-gray-400 text-sm mt-1">Ногти, ресницы, волосы</p>
              </div>
            </a>

            <a href="#service" className="group flex items-center gap-4 bg-white hover:bg-mint-400/5 border border-gray-200 hover:border-mint-400/50 rounded-2xl p-5 transition-all duration-300 flex-1 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-mint-400/15 rounded-xl flex items-center justify-center shrink-0">
                <UsersIcon className="w-6 h-6 text-mint-600" />
              </div>
              <div>
                <span className="text-gray-900 font-semibold text-lg group-hover:text-mint-600 transition-colors">Работа с гостями</span>
                <p className="text-gray-400 text-sm mt-1">Можно без опыта</p>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#quiz" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
              Оставить заявку
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 border border-gray-200 shadow-sm">
              <WhatsAppIcon className="w-5 h-5 text-green-500" />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDownIcon className="w-6 h-6 text-gray-300" />
      </div>
    </section>
  )
}
