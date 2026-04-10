import { useLang } from '../i18n'

const teamImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
const officeImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'

export default function AboutPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'

  const values = isRu
    ? [
        { title: 'Прозрачность', desc: 'Все условия фиксируются документально до вылета. Никаких скрытых платежей и устных договорённостей.' },
        { title: 'Безопасность', desc: 'Работаем только с проверенными работодателями. Координатор на месте 24/7. Паспорт всегда остаётся у кандидата.' },
        { title: 'Поддержка', desc: 'Мы не бросаем после оформления. Сопровождаем весь период контракта — помогаем решать любые вопросы.' },
        { title: 'Уважение', desc: 'Мы видим в каждом кандидате человека с мечтой и целями, а не просто заявку в системе.' },
      ]
    : [
        { title: 'Transparency', desc: 'All conditions are documented before departure. No hidden fees or verbal agreements.' },
        { title: 'Safety', desc: 'We only work with verified employers. On-site coordinator 24/7. Passport always stays with the candidate.' },
        { title: 'Support', desc: 'We do not abandon you after processing. We accompany the entire contract period — helping solve any issues.' },
        { title: 'Respect', desc: 'We see every candidate as a person with dreams and goals, not just an application in the system.' },
      ]

  const stats = [
    { value: '350+', label: isRu ? 'Трудоустроены' : 'Placed' },
    { value: '4', label: isRu ? 'Страны' : 'Countries' },
    { value: '7', label: isRu ? 'Лет на рынке' : 'Years in business' },
    { value: '98%', label: isRu ? 'Довольны' : 'Satisfied' },
  ]

  return (
    <main style={{ background: '#faf9f6', color: '#1a1c1a' }} className="font-manrope">
      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-[#faf9f6] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#775a19]" />
            <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
              {isRu ? 'О компании' : 'About us'}
            </span>
          </div>
          <h1 className="font-noto text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#1a1c1a] mb-8" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Мы создаём мост<br /><span className="italic text-[#775a19]">между мечтой и работой</span></>
            ) : (
              <>We build a bridge<br /><span className="italic text-[#775a19]">between dreams and work</span></>
            )}
          </h1>
          <p className="font-manrope text-lg md:text-xl text-[#4e4639] max-w-2xl leading-relaxed">
            {isRu
              ? 'Legacy — рекрутинговое агентство, работающее с 2019 года. Мы помогаем специалистам из стран СНГ найти достойную работу за рубежом в сфере красоты и гостеприимства.'
              : 'Legacy is a recruitment agency working since 2019. We help specialists from CIS countries find quality employment abroad in beauty and hospitality.'}
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#775a19]" />
                <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                  {isRu ? 'Наша миссия' : 'Our Mission'}
                </span>
              </div>
              <h2 className="font-noto text-4xl md:text-5xl leading-tight mb-8 text-[#1a1c1a]" style={{ fontWeight: 400 }}>
                {isRu ? (
                  <>Сделать трудоустройство<br /><span className="italic text-[#775a19]">честным и доступным</span></>
                ) : (
                  <>Make employment<br /><span className="italic text-[#775a19]">honest and accessible</span></>
                )}
              </h2>
              <p className="font-manrope text-[#4e4639] leading-relaxed mb-4">
                {isRu
                  ? 'Работа за границей не должна быть лотереей, где ты ставишь на кон своё будущее. Мы создаём систему, в которой каждый шаг понятен, каждое условие прозрачно, а каждый кандидат знает, что за ним стоит команда.'
                  : 'Working abroad should not be a lottery where you bet your future. We create a system where every step is clear, every condition transparent, and every candidate knows there is a team behind them.'}
              </p>
              <p className="font-manrope text-[#4e4639] leading-relaxed">
                {isRu
                  ? 'За 7 лет мы помогли более чем 350 людям начать новую главу жизни в ОАЭ, Катаре, Кувейте и Саудовской Аравии.'
                  : 'In 7 years, we have helped over 350 people start a new chapter in UAE, Qatar, Kuwait and Saudi Arabia.'}
              </p>
            </div>
            <div className="relative">
              <img src={teamImage} alt="" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute -bottom-8 -left-8 bg-[#faf9f6] p-8 hidden lg:block max-w-xs">
                <p className="font-noto italic text-xl text-[#775a19] leading-relaxed" style={{ fontWeight: 400 }}>
                  {isRu ? '«Мы видим в каждом кандидате человека»' : '«We see a person in every candidate»'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-28 md:py-32 bg-[#faf9f6]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                {isRu ? 'В цифрах' : 'In numbers'}
              </span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-noto text-5xl md:text-6xl text-[#775a19] mb-3" style={{ fontWeight: 500 }}>
                  {stat.value}
                </p>
                <div className="w-8 h-px bg-[#d1c5b4] mx-auto mb-3" />
                <p className="font-manrope text-[11px] tracking-[0.15em] uppercase text-[#7f7667]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                {isRu ? 'Наши ценности' : 'Our values'}
              </span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Во что мы<br /><span className="italic text-[#775a19]">верим</span></>
              ) : (
                <>What we<br /><span className="italic text-[#775a19]">believe in</span></>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {values.map((v, i) => (
              <div key={i} className="bg-[#faf9f6] p-10 md:p-14 hover:bg-white transition-all duration-700">
                <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-noto text-3xl text-[#1a1c1a] mb-4 leading-tight" style={{ fontWeight: 500 }}>
                  {v.title}
                </h3>
                <p className="font-manrope text-[#4e4639] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICE */}
      <section className="py-28 md:py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img src={officeImage} alt="" className="w-full aspect-[4/3] object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#775a19]" />
                <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                  {isRu ? 'Наш офис' : 'Our office'}
                </span>
              </div>
              <h2 className="font-noto text-4xl md:text-5xl leading-tight mb-8 text-[#1a1c1a]" style={{ fontWeight: 400 }}>
                {isRu ? 'Приходите в гости' : 'Come visit us'}
              </h2>
              <div className="space-y-6 font-manrope text-[#4e4639]">
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2">
                    {isRu ? 'Адрес' : 'Address'}
                  </p>
                  <p>{isRu ? 'г. Бишкек, ул. Киевская 107, каб. 515' : '107 Kievskaya St., office 515, Bishkek'}</p>
                </div>
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2">
                    {isRu ? 'Режим работы' : 'Hours'}
                  </p>
                  <p>{isRu ? 'Пн–Пт, 10:00–18:00' : 'Mon–Fri, 10:00–18:00'}</p>
                </div>
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2">
                    {isRu ? 'Телефон' : 'Phone'}
                  </p>
                  <a href="tel:+996707605575" className="hover:text-[#775a19] transition-colors">+996 707 60 55 75</a>
                </div>
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2">Email</p>
                  <a href="mailto:cv@legacygroup.work" className="hover:text-[#775a19] transition-colors">cv@legacygroup.work</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#f4f3f1]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight mb-8" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Готовы <span className="italic text-[#775a19]">начать</span>?</>
            ) : (
              <>Ready to <span className="italic text-[#775a19]">start</span>?</>
            )}
          </h2>
          <p className="font-manrope text-[#4e4639] mb-10">
            {isRu ? 'Ответьте на 5 вопросов — мы подберём подходящую вакансию.' : 'Answer 5 questions — we will find a suitable vacancy.'}
          </p>
          <a
            href="/#quiz"
            className="satin-gradient text-white px-12 py-5 inline-block font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
          >
            {isRu ? 'Оставить заявку' : 'Apply now'}
          </a>
        </div>
      </section>
    </main>
  )
}
