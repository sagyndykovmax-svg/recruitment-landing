import { useState } from 'react'
import { CheckIcon, WhatsAppIcon } from './Icons'

const steps = [
  {
    question: 'Какое направление вас интересует?',
    key: 'direction',
    options: [
      { value: 'beauty', label: 'Бьюти (ногти, ресницы, волосы)' },
      { value: 'service', label: 'Сфера сервиса (хостес, официант, ресепшн)' },
      { value: 'both', label: 'Рассмотрю оба варианта' },
    ],
  },
  {
    question: 'Есть ли у вас опыт работы?',
    key: 'experience',
    options: [
      { value: 'experienced', label: 'Да, есть опыт (от 1 года)' },
      { value: 'some', label: 'Небольшой опыт (до 1 года)' },
      { value: 'none', label: 'Нет опыта, но хочу начать' },
    ],
  },
  {
    question: 'Есть ли у вас загранпаспорт?',
    key: 'passport',
    options: [
      { value: 'yes', label: 'Да, есть действующий' },
      { value: 'making', label: 'В процессе оформления' },
      { value: 'no', label: 'Нет, но готов(а) оформить' },
    ],
  },
]

export default function QuizSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState(null)

  const totalSteps = steps.length + 1 // quiz steps + contact form

  const handleOption = (key, value) => {
    setSelected(value)
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setSelected(null)
    }, 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const directionMap = { beauty: 'Бьюти', service: 'Сфера сервиса', both: 'Оба направления' }
    const experienceMap = { experienced: 'Есть опыт (от 1 года)', some: 'Небольшой опыт', none: 'Без опыта' }
    const passportMap = { yes: 'Есть', making: 'В процессе', no: 'Нет, готов(а) оформить' }

    const message = `Новая заявка с сайта:\n\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${directionMap[answers.direction] || '—'}\nОпыт: ${experienceMap[answers.experience] || '—'}\nЗагранпаспорт: ${passportMap[answers.passport] || '—'}`

    console.log('Quiz submitted:', { ...answers, name, phone })
    console.log('WhatsApp message:', message)
    setSubmitted(true)
  }

  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="quiz">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Узнайте, подходите ли вы</h2>
            <p className="text-gray-500">Ответьте на 3 вопроса — мы свяжемся с подходящей вакансией</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-brand-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          {/* Quiz steps */}
          {currentStep < steps.length && (
            <div className="quiz-step-enter" key={currentStep}>
              <p className="font-semibold text-lg mb-5">{steps[currentStep].question}</p>
              <div className="space-y-3">
                {steps[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleOption(steps[currentStep].key, opt.value)}
                    className={`quiz-option w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-brand-400 transition-colors ${selected === opt.value ? 'selected' : ''}`}
                  >
                    <span className="font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact form */}
          {currentStep === steps.length && !submitted && (
            <div className="quiz-step-enter">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-semibold text-lg">Отлично! Для вас есть подходящие вакансии</p>
                <p className="text-gray-500 text-sm mt-1">Оставьте контакт — мы свяжемся в течение 2 часов</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-base"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp номер"
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-base"
                />
                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
                >
                  Отправить заявку
                </button>
                <p className="text-center text-gray-400 text-xs">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                </p>
              </form>
            </div>
          )}

          {/* Success */}
          {submitted && (
            <div className="quiz-step-enter text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Заявка отправлена!</h3>
              <p className="text-gray-500 mb-6">Мы свяжемся с вами в WhatsApp в течение 2 часов</p>
              <a
                href="https://wa.me/YOUR_NUMBER"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Написать нам сейчас
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
