import { ArrowRightIcon } from './Icons'

export default function UrgencySection() {
  return (
    <section className="py-16 bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-sm px-4 py-2 rounded-full mb-6 border border-red-500/20">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          Ограниченный набор
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Осталось <span className="text-brand-400">12 мест</span> на апрель
        </h2>
        <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
          Набор ведётся партиями. Текущая группа формируется прямо сейчас. Чем раньше подадите заявку — тем быстрее начнёте работать
        </p>
        <a href="#quiz" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
          Занять место
          <ArrowRightIcon className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}
