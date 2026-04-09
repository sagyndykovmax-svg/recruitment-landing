import { useState } from 'react'
import { useLang } from '../i18n'
import { CheckIcon } from '../components/Icons'

export default function EmployersPage() {
  const { t } = useLang()
  const e = t.employers
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="pt-20">
      <section className="py-20 bg-gradient-to-b from-mint-400/10 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">{e.title}</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{e.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{e.offerTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {e.offers.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{e.howTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {e.howSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-mint-500 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-3">{i + 1}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="employer-form">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-center mb-2">{e.formTitle}</h2>
            <p className="text-gray-500 text-center mb-8">{e.formSubtitle}</p>

            {!submitted ? (
              <form onSubmit={(ev) => { ev.preventDefault(); setSubmitted(true) }} className="space-y-4">
                <input type="text" placeholder={e.companyName} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder={e.country} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                  <input type="text" placeholder={e.city} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                </div>
                <input type="text" placeholder={e.contactPerson} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <input type="tel" placeholder={e.phone} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <input type="text" placeholder={e.specialists} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white" />
                <textarea placeholder={e.additional} rows={3} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none bg-white resize-none" />
                <button type="submit" className="w-full bg-mint-500 hover:bg-mint-600 text-white font-semibold py-4 rounded-xl text-lg transition-all">{e.submit}</button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{e.done}</h3>
                <p className="text-gray-500">{e.doneDesc}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
