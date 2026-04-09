import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLang } from '../i18n'
import { SparklesIcon, CheckIcon, MoneyIcon, GlobeIcon, RocketIcon, ArrowRightIcon } from './Icons'

export default function BeautySection() {
  const ref = useScrollAnimation()
  const { t } = useLang()
  const b = t.beauty

  return (
    <section className="py-20 lg:py-28 bg-white border-t-4 border-brand-300" id="beauty">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">{b.tag}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{b.title}</h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl">{b.subtitle}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            { value: b.salary, label: b.salaryDesc, color: 'text-brand-500' },
            { value: b.housing, label: b.housingDesc, color: 'text-gray-900' },
            { value: b.schedule, label: b.scheduleDesc, color: 'text-gray-900' },
            { value: b.contract, label: b.contractDesc, color: 'text-gray-900' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className={`text-3xl font-bold ${item.color} mb-2`}>{item.value}</div>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-white border border-brand-100 rounded-2xl p-8 mb-16">
          <h3 className="text-xl font-bold mb-6">{b.reqTitle}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {b.reqs.map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-6">{b.whyTitle}</h3>
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <MoneyIcon className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', title: b.adv1, desc: b.adv1Desc },
            { icon: <GlobeIcon className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: b.adv2, desc: b.adv2Desc },
            { icon: <RocketIcon className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: b.adv3, desc: b.adv3Desc },
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
            {b.cta}
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
