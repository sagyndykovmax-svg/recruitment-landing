import { useState } from 'react'
import { useLang } from '../i18n'
import { CheckIcon, WhatsAppIcon } from './Icons'

const stepKeys = ['direction', 'age', 'experience', 'english', 'passport']
const stepValues = [
  ['beauty', 'service', 'both'],
  ['18-22', '23-27', '28-35', '35+'],
  ['experienced', 'some', 'none'],
  ['none', 'basic', 'intermediate', 'fluent'],
  ['yes', 'making', 'no'],
]

export default function QuizSection() {
  const { t } = useLang()
  const q = t.quiz
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState(null)

  const totalSteps = q.steps.length + 1

  const handleOption = (value, stepIdx) => {
    setSelected(value)
    setAnswers((prev) => ({ ...prev, [stepKeys[stepIdx]]: value }))
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setSelected(null)
    }, 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Quiz submitted:', { ...answers, name, phone })
    setSubmitted(true)
  }

  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="quiz">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{q.title}</h2>
            <p className="text-gray-500">{q.subtitle}</p>
          </div>

          <div className="flex gap-2 mb-8">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-brand-500' : 'bg-gray-200'}`} />
            ))}
          </div>

          {currentStep < q.steps.length && (
            <div className="quiz-step-enter" key={currentStep}>
              <p className="font-semibold text-lg mb-5">{q.steps[currentStep].question}</p>
              <div className="space-y-3">
                {q.steps[currentStep].options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleOption(stepValues[currentStep]?.[oi] || opt, currentStep)}
                    className={`quiz-option w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-brand-400 transition-colors ${selected === (stepValues[currentStep]?.[oi] || opt) ? 'selected' : ''}`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === q.steps.length && !submitted && (
            <div className="quiz-step-enter">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-semibold text-lg">{q.success}</p>
                <p className="text-gray-500 text-sm mt-1">{q.successDesc}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={q.namePlaceholder} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-base" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={q.phonePlaceholder} required className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-base" />
                <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25">{q.submit}</button>
                <p className="text-center text-gray-400 text-xs">{q.consent}</p>
              </form>
            </div>
          )}

          {submitted && (
            <div className="quiz-step-enter text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{q.done}</h3>
              <p className="text-gray-500 mb-6">{q.doneDesc}</p>
              <a href="https://wa.me/996707605575" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                <WhatsAppIcon className="w-5 h-5" />
                {q.doneBtn}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
