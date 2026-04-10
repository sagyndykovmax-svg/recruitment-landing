import { useState } from 'react'
import { useLang } from '../i18n'

const heroImage = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80'

export default function EmployersPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const [submitted, setSubmitted] = useState(false)

  const offers = isRu
    ? [
        { title: 'Подбор персонала', desc: 'Нейл-мастера, парикмахеры, лешмейкеры, хостес, официанты, администраторы' },
        { title: 'Проверенные кандидаты', desc: 'Каждый кандидат проходит анкетирование, проверку портфолио и интервью' },
        { title: 'Подготовка к работе', desc: 'Обучение стандартам сервиса, языковая подготовка, культурная адаптация' },
        { title: 'Оформление документов', desc: 'Помогаем с визой, медосмотром, контрактом и перелётом' },
        { title: 'Замена кандидата', desc: 'Если кандидат не подошёл — подберём замену без дополнительных затрат' },
        { title: 'Постоянная поддержка', desc: 'Координатор на месте решает вопросы адаптации и коммуникации' },
      ]
    : [
        { title: 'Staff Recruitment', desc: 'Nail technicians, hairstylists, lash makers, hostesses, waiters, administrators' },
        { title: 'Verified Candidates', desc: 'Every candidate goes through questionnaire, portfolio review and interview' },
        { title: 'Work Preparation', desc: 'Service standards training, language preparation, cultural adaptation' },
        { title: 'Document Processing', desc: 'We help with visa, medical examination, contract and flights' },
        { title: 'Candidate Replacement', desc: "If a candidate doesn't fit — we find a replacement at no extra cost" },
        { title: 'Ongoing Support', desc: 'On-site coordinator handles adaptation and communication issues' },
      ]

  const steps = isRu
    ? [
        { title: 'Заявка', desc: 'Вы описываете позицию, требования и условия' },
        { title: 'Подбор', desc: 'Мы подбираем подходящих кандидатов из базы' },
        { title: 'Интервью', desc: 'Вы проводите интервью и выбираете кандидата' },
        { title: 'Оформление', desc: 'Мы оформляем документы и организуем приезд' },
      ]
    : [
        { title: 'Request', desc: 'You describe the position, requirements and conditions' },
        { title: 'Selection', desc: 'We select suitable candidates from our database' },
        { title: 'Interview', desc: 'You conduct an interview and choose a candidate' },
        { title: 'Processing', desc: 'We process documents and organize arrival' },
      ]

  return (
    <main style={{ background: '#faf9f6', color: '#1a1c1a' }} className="font-manrope">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 bg-[#faf9f6] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#775a19]" />
            <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
              {isRu ? 'Для работодателей' : 'For employers'}
            </span>
          </div>
          <h1 className="font-noto text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#1a1c1a] mb-8 max-w-3xl" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Проверенные специалисты<br /><span className="italic text-[#775a19]">для вашего бизнеса</span></>
            ) : (
              <>Verified specialists<br /><span className="italic text-[#775a19]">for your business</span></>
            )}
          </h1>
          <p className="font-manrope text-lg md:text-xl text-[#4e4639] max-w-2xl leading-relaxed">
            {isRu
              ? 'Мы подбираем квалифицированных сотрудников из стран СНГ для салонов красоты, отелей и ресторанов премиум-класса. Быстро, надёжно, с гарантией замены.'
              : 'We recruit qualified employees from CIS countries for beauty salons, hotels and premium restaurants. Fast, reliable, with replacement guarantee.'}
          </p>
          <div className="pt-10">
            <a
              href="#employer-form"
              className="satin-gradient text-white px-10 py-5 inline-block font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
            >
              {isRu ? 'Оставить заявку' : 'Submit request'}
            </a>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                {isRu ? 'Что мы предлагаем' : 'What we offer'}
              </span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Полный цикл<br /><span className="italic text-[#775a19]">под ключ</span></>
              ) : (
                <>Full cycle<br /><span className="italic text-[#775a19]">turnkey</span></>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {offers.map((offer, i) => (
              <div key={i} className="bg-[#faf9f6] p-10 hover:bg-white transition-all duration-700">
                <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-noto text-2xl text-[#1a1c1a] mb-4 leading-tight" style={{ fontWeight: 500 }}>
                  {offer.title}
                </h3>
                <p className="font-manrope text-sm text-[#4e4639] leading-relaxed">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-28 md:py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">Process</span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Как мы<br /><span className="italic text-[#775a19]">работаем</span></>
              ) : (
                <>How we<br /><span className="italic text-[#775a19]">work</span></>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
            {steps.map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="font-noto text-5xl text-[#775a19] mb-4" style={{ fontWeight: 400 }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="w-8 h-px bg-[#d1c5b4] mb-4 mx-auto md:mx-0" />
                <h4 className="font-noto text-xl text-[#1a1c1a] mb-2" style={{ fontWeight: 500 }}>{s.title}</h4>
                <p className="font-manrope text-sm text-[#7f7667] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]" id="employer-form">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                {isRu ? 'Заявка' : 'Request'}
              </span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight mb-6" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Оставить <span className="italic text-[#775a19]">заявку</span></>
              ) : (
                <>Submit <span className="italic text-[#775a19]">request</span></>
              )}
            </h2>
            <p className="font-manrope text-[#4e4639]">
              {isRu ? 'Мы свяжемся с вами в течение 24 часов.' : "We'll contact you within 24 hours."}
            </p>
          </div>

          <div className="bg-[#faf9f6] p-8 md:p-14">
            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-8">
                <div>
                  <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                    {isRu ? 'Название компании' : 'Company name'}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                      {isRu ? 'Страна' : 'Country'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                    />
                  </div>
                  <div>
                    <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                      {isRu ? 'Город' : 'City'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                      {isRu ? 'Контактное лицо' : 'Contact person'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                    />
                  </div>
                  <div>
                    <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                      {isRu ? 'WhatsApp / Телефон' : 'WhatsApp / Phone'}
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                    {isRu ? 'Какие специалисты нужны?' : 'What specialists do you need?'}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                  />
                </div>
                <div>
                  <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                    {isRu ? 'Дополнительная информация' : 'Additional information'}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="satin-gradient text-white w-full px-10 py-5 font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
                >
                  {isRu ? 'Отправить заявку' : 'Submit request'}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 border border-[#775a19] mx-auto mb-8 flex items-center justify-center">
                  <span className="text-[#775a19] text-2xl">✓</span>
                </div>
                <p className="font-noto text-3xl text-[#1a1c1a] mb-4" style={{ fontWeight: 500 }}>
                  {isRu ? 'Заявка отправлена' : 'Request submitted'}
                </p>
                <p className="font-manrope text-[#7f7667]">
                  {isRu ? 'Мы свяжемся с вами в течение 24 часов.' : "We'll contact you within 24 hours."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
