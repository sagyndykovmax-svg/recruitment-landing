import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ChevronDownIcon } from './Icons'

const faqs = [
  {
    q: 'Это не обман? Как я могу доверять?',
    a: 'Мы работаем по договору. Вы не платите до момента одобрения вашей кандидатуры. Мы предоставляем контакты людей, которые уже работают через нас, — можете написать им напрямую. Все условия фиксируются документально до вылета.',
  },
  {
    q: 'А если мне не понравится — можно вернуться?',
    a: 'Да. Вы не раб и не заложник. Контракт заключается на определённый срок, но при желании вы можете вернуться. Паспорт остаётся у вас. Это законное трудоустройство с соблюдением трудового законодательства страны пребывания.',
  },
  {
    q: 'Кто оплачивает перелёт и оформление?',
    a: 'В большинстве случаев перелёт и виза оплачиваются работодателем. Вам может потребоваться оплатить медицинское обследование и оформление загранпаспорта (если его нет). Все расходы обсуждаются заранее — никаких скрытых платежей.',
  },
  {
    q: 'А если я не подойду?',
    a: 'Мы честно скажем, если сейчас вакансия не для вас. Но поможем подготовиться: подскажем, какие навыки прокачать, что добавить в портфолио. Многие возвращаются через 2–3 месяца и уезжают работать.',
  },
  {
    q: 'Безопасно ли это?',
    a: 'Да. Каждый работодатель проверяется до начала сотрудничества. Вы работаете в легальных компаниях с охраной. Паспорт всегда остаётся у вас — это закон. Жильё в безопасных районах. На месте — русскоязычный координатор, к которому можно обратиться 24/7. Мы на связи весь период контракта: вы можете позвонить или написать в любой момент. За 3 года работы ни одного инцидента.',
  },
  {
    q: 'Нужен ли английский?',
    a: 'Для бьюти-мастеров — минимальный уровень, достаточно базовых фраз. Для сферы сервиса — желательно, но не обязательно. Многие учат язык уже на месте. Главное — желание работать и общаться.',
  },
]

export default function FaqSection() {
  const ref = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState(-1)

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i)

  return (
    <section className="py-20 lg:py-28 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Частые вопросы</h2>
        <p className="text-gray-500 text-lg text-center mb-12">Мы понимаем, что есть сомнения. Вот честные ответы</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-gray-50 transition-colors"
              >
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
