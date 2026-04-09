import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLang } from '../i18n'
import { ChevronDownIcon } from './Icons'

export default function FaqSection() {
  const ref = useScrollAnimation()
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState(-1)
  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i)

  return (
    <section className="py-20 lg:py-28 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{t.faq.title}</h2>
        <p className="text-gray-500 text-lg text-center mb-12">{t.faq.subtitle}</p>

        <div className="space-y-3">
          {t.faq.items.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-gray-50 transition-colors">
                <span>{faq.q}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`faq-content px-5 ${openIndex === i ? 'open pb-5' : ''}`}>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
