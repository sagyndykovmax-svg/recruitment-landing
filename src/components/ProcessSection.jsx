import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLang } from '../i18n'
import { ArrowRightIcon } from './Icons'

export default function ProcessSection() {
  const ref = useScrollAnimation()
  const { t } = useLang()
  const p = t.process

  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="process">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{p.title}</h2>
        <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl mx-auto">{p.subtitle}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {p.steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className={`w-14 h-14 ${i === 4 ? 'bg-mint-500' : 'bg-brand-500'} text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                {i + 1}
              </div>
              <h4 className="font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-500 text-sm">{step.desc}</p>
              {i < 4 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-brand-200" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a href="#quiz" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">
            {p.cta}
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
