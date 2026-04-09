import { useLang } from '../i18n'
import { ArrowRightIcon } from './Icons'

export default function UrgencySection() {
  const { t } = useLang()
  const u = t.urgency

  return (
    <section className="py-16 bg-gradient-to-r from-brand-50 via-brand-100/50 to-mint-400/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-200/50 text-brand-700 text-sm px-4 py-2 rounded-full mb-6 border border-brand-200">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          {u.badge}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {u.title1} <span className="text-brand-500">{u.title2}</span>
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">{u.subtitle}</p>
        <a href="#quiz" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
          {u.cta}
          <ArrowRightIcon className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}
