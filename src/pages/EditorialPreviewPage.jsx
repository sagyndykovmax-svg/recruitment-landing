import { useState, useEffect, useRef } from 'react'
import { useLang } from '../i18n'

// Stock images (Unsplash, free)
const heroImage = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=80'
const beautyImage = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80'
const hospitalityImage = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
const portraitImage = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80'

const countries = [
  {
    code: 'UAE',
    nameRu: 'ОАЭ',
    nameEn: 'UAE',
    cityRu: 'Дубай · Абу-Даби',
    cityEn: 'Dubai · Abu Dhabi',
    descRu: 'Эпицентр мировых бьюти-трендов. Работа в премиальных салонах и 5★ отелях Дубая.',
    descEn: 'Epicenter of global beauty trends. Work in premium salons and 5★ hotels.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    offset: 0,
  },
  {
    code: 'QA',
    nameRu: 'Катар',
    nameEn: 'Qatar',
    cityRu: 'Доха',
    cityEn: 'Doha',
    descRu: 'Утончённая роскошь и культурное наследие. Элитные wellness-центры Дохи.',
    descEn: 'Refined luxury and cultural heritage. Elite wellness centers of Doha.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80',
    offset: 48,
  },
  {
    code: 'KW',
    nameRu: 'Кувейт',
    nameEn: 'Kuwait',
    cityRu: 'Эль-Кувейт',
    cityEn: 'Kuwait City',
    descRu: 'Высокий доход и состоятельная клиентура. Комфортный климат для жизни.',
    descEn: 'High income and affluent clientele. Comfortable lifestyle.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
    offset: 96,
  },
  {
    code: 'SA',
    nameRu: 'Саудовская Аравия',
    nameEn: 'Saudi Arabia',
    cityRu: 'Эр-Рияд · Джидда',
    cityEn: 'Riyadh · Jeddah',
    descRu: 'Быстрорастущий рынок с уникальными возможностями и высокими зарплатами.',
    descEn: 'Fast-growing market with unique opportunities and high salaries.',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=900&q=80',
    offset: 144,
  },
]

const reviewsData = {
  ru: [
    { initial: 'Ж', name: 'Жазгуль', role: 'Nail Master · Дубай', text: 'Работаю в Дубае уже полгода. Сначала было страшно, но команда Legacy помогла на каждом этапе — от оформления документов до адаптации на месте.' },
    { initial: 'А', name: 'Азема', role: 'Lash artist · Дубай', text: 'Подруга посоветовала Legacy. Оформили быстро, всё прозрачно. Встретили в аэропорту, заселили. Работодатель адекватный, условия соответствуют обещанным.' },
    { initial: 'М', name: 'Маргарита', role: 'Hairstylist · Доха', text: 'Уехала работать через Legacy и не пожалела. Контракт понятный, паспорт у меня, координатор на связи. За 4 месяца накопила больше, чем за год дома.' },
    { initial: 'Ф', name: 'Феруза', role: 'Hostess · Дубай', text: 'Долго сомневалась, но решилась. Legacy всё организовали: визу, билеты, жильё. На месте есть русскоязычный координатор. Рекомендую.' },
  ],
  en: [
    { initial: 'Z', name: 'Zhazgul', role: 'Nail Master · Dubai', text: "I've been working in Dubai for 6 months. It was scary at first, but the Legacy team helped at every step — from paperwork to settling in on-site." },
    { initial: 'A', name: 'Azema', role: 'Lash artist · Dubai', text: 'A friend recommended Legacy. Processed quickly, everything was transparent. Met at the airport, settled in. Fair employer, conditions match what was promised.' },
    { initial: 'M', name: 'Margarita', role: 'Hairstylist · Doha', text: "Moved through Legacy and don't regret it. Clear contract, passport stays with me, coordinator always available. Saved more in 4 months than a full year back home." },
    { initial: 'F', name: 'Feruza', role: 'Hostess · Dubai', text: "I hesitated for a long time but went for it. Legacy organized everything: visa, tickets, housing. Russian-speaking coordinator on-site. Highly recommend." },
  ],
}

function useCounter(target, duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const update = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(target * eased))
            if (p < 1) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return { ref, value }
}

export default function EditorialPreviewPage() {
  const { lang, setLang, t } = useLang()
  const isRu = lang === 'ru'
  const reviews = reviewsData[lang]

  const people = useCounter(350)
  const countriesCount = useCounter(4)
  const years = useCounter(3)

  return (
    <div style={{ background: '#faf9f6', color: '#1a1c1a' }} className="min-h-screen font-manrope">
      {/* Preview notice */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1c1a] text-[#faf9f6] text-center py-2 text-[10px] md:text-xs tracking-[0.2em] uppercase">
        Preview · Editorial v4 · <a href="/" className="underline">{isRu ? '← вернуться' : '← back'}</a>
      </div>

      {/* NAV */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-[#faf9f6]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
          <a href="#hero" className="font-noto italic text-xl md:text-2xl tracking-tight text-[#1a1c1a]">Legacy</a>
          <div className="hidden md:flex gap-10">
            <a className="font-noto uppercase tracking-[0.2em] text-[11px] text-[#7f7667] hover:text-[#775a19] transition-colors" href="#destinations">{isRu ? 'Страны' : 'Countries'}</a>
            <a className="font-noto uppercase tracking-[0.2em] text-[11px] text-[#7f7667] hover:text-[#775a19] transition-colors" href="#tracks">{isRu ? 'Направления' : 'Tracks'}</a>
            <a className="font-noto uppercase tracking-[0.2em] text-[11px] text-[#7f7667] hover:text-[#775a19] transition-colors" href="#process">{isRu ? 'Процесс' : 'Process'}</a>
            <a className="font-noto uppercase tracking-[0.2em] text-[11px] text-[#7f7667] hover:text-[#775a19] transition-colors" href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(isRu ? 'en' : 'ru')}
              className="font-manrope text-[11px] tracking-widest uppercase text-[#7f7667] hover:text-[#775a19] transition-colors"
            >
              {isRu ? 'EN' : 'RU'}
            </button>
            <a href="#quiz" className="hidden sm:inline font-noto uppercase tracking-[0.2em] text-[11px] text-[#775a19] border-b border-[#775a19] pb-1 hover:opacity-80 transition-all">
              {isRu ? 'Оставить заявку' : 'Apply'}
            </a>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#faf9f6] pt-24" id="hero">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
                {isRu ? 'Legacy · С 2023 года' : 'Legacy · Since 2023'}
              </span>
            </div>

            <h1 className="font-noto text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-[#1a1c1a]" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Работа за границей<br /><span className="italic text-[#775a19]">в сфере сервиса и красоты</span></>
              ) : (
                <>Work abroad<br /><span className="italic text-[#775a19]">in beauty & hospitality</span></>
              )}
            </h1>

            <p className="font-manrope text-lg text-[#4e4639] max-w-xl leading-relaxed">
              {isRu
                ? '350+ девушек из СНГ уже работают в ОАЭ, Катаре, Кувейте и Саудовской Аравии. Честное трудоустройство, прозрачные условия, поддержка на каждом шаге.'
                : '350+ women from CIS countries already work in UAE, Qatar, Kuwait and Saudi Arabia. Fair employment, transparent conditions, support every step of the way.'}
            </p>

            {/* Track cards */}
            <div className="pt-4">
              <p className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#7f7667] mb-4">
                {isRu ? 'Выберите направление' : 'Choose your path'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                <a href="#beauty" className="group bg-[#faf9f6] p-6 hover:bg-white transition-all duration-500">
                  <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mb-3">01 · Beauty</p>
                  <p className="font-noto text-xl text-[#1a1c1a] mb-1" style={{ fontWeight: 500 }}>
                    {isRu ? 'Я мастер' : 'Beauty specialist'}
                  </p>
                  <p className="font-manrope text-xs text-[#7f7667]">
                    {isRu ? 'Ногти, ресницы, волосы' : 'Nails, lashes, hair'}
                  </p>
                </a>
                <a href="#service" className="group bg-[#faf9f6] p-6 hover:bg-white transition-all duration-500">
                  <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mb-3">02 · Service</p>
                  <p className="font-noto text-xl text-[#1a1c1a] mb-1" style={{ fontWeight: 500 }}>
                    {isRu ? 'Работа с гостями' : 'Hospitality'}
                  </p>
                  <p className="font-manrope text-xs text-[#7f7667]">
                    {isRu ? 'Можно без опыта' : 'No experience needed'}
                  </p>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href="#quiz"
                className="satin-gradient text-white px-10 py-5 inline-block text-center font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90 hover:shadow-xl"
              >
                {isRu ? 'Оставить заявку' : 'Apply now'}
              </a>
              <a
                href="https://wa.me/996707605575"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-5 border border-[#d1c5b4] text-[#775a19] font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:bg-[#775a19] hover:text-white hover:border-[#775a19]"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right side: floating editorial card */}
          <div className="hidden md:block md:col-span-5 md:pl-8">
            <div className="bg-[#faf9f6]/70 backdrop-blur-sm border border-[#d1c5b4]/30 p-10">
              <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-6">
                {isRu ? 'Legacy в цифрах' : 'Legacy in numbers'}
              </p>
              <div className="space-y-8">
                <div>
                  <p ref={people.ref} className="font-noto text-5xl text-[#775a19]" style={{ fontWeight: 500 }}>{people.value}+</p>
                  <p className="font-manrope text-xs tracking-[0.15em] uppercase text-[#7f7667] mt-2">
                    {isRu ? 'Трудоустроены' : 'Placed'}
                  </p>
                </div>
                <div className="w-16 h-px bg-[#d1c5b4]" />
                <div>
                  <p ref={countriesCount.ref} className="font-noto text-5xl text-[#775a19]" style={{ fontWeight: 500 }}>{countriesCount.value}</p>
                  <p className="font-manrope text-xs tracking-[0.15em] uppercase text-[#7f7667] mt-2">
                    {isRu ? 'Страны' : 'Countries'}
                  </p>
                </div>
                <div className="w-16 h-px bg-[#d1c5b4]" />
                <div>
                  <p ref={years.ref} className="font-noto text-5xl text-[#775a19]" style={{ fontWeight: 500 }}>{years.value}</p>
                  <p className="font-manrope text-xs tracking-[0.15em] uppercase text-[#7f7667] mt-2">
                    {isRu ? 'Года на рынке' : 'Years in business'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-8 z-10 hidden lg:flex flex-col items-center gap-3">
          <span className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#7f7667]" style={{ writingMode: 'vertical-rl' }}>
            {isRu ? 'Прокрутить' : 'Scroll'}
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-[#7f7667] to-transparent" />
        </div>
      </section>

      {/* ========== DESTINATIONS ========== */}
      <section className="py-28 md:py-32 bg-[#faf9f6]" id="destinations">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#775a19]" />
                <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">Destinations</span>
              </div>
              <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
                {isRu ? (
                  <>Четыре направления<br /><span className="italic text-[#775a19]">Персидского залива</span></>
                ) : (
                  <>Four destinations<br /><span className="italic text-[#775a19]">in the Gulf</span></>
                )}
              </h2>
            </div>
            <p className="font-manrope text-[#4e4639] max-w-sm">
              {isRu
                ? 'Испытайте стиль жизни в самых динамичных бьюти- и сервис-хабах мира.'
                : 'Experience a lifestyle in the most dynamic beauty and hospitality hubs in the world.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            {countries.map((c, i) => (
              <div
                key={i}
                className="group relative overflow-hidden h-[480px] bg-[#f4f3f1] transition-all duration-700 hover:bg-white cursor-pointer"
                style={{ marginTop: `${c.offset}px` }}
              >
                <img
                  src={c.image}
                  alt={isRu ? c.nameRu : c.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a]/90 via-[#1a1c1a]/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="font-manrope text-[10px] tracking-[0.35em] uppercase text-[#c5a059] mb-3">{c.code}</p>
                  <h3 className="font-noto text-3xl text-white mb-2 leading-tight" style={{ fontWeight: 400 }}>
                    {isRu ? c.nameRu : c.nameEn}
                  </h3>
                  <p className="font-manrope text-[11px] tracking-[0.1em] uppercase text-white/70 mb-4">
                    {isRu ? c.cityRu : c.cityEn}
                  </p>
                  <p className="font-manrope text-sm text-white/85 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {isRu ? c.descRu : c.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TWO TRACKS (Beauty + Service editorial) ========== */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]" id="tracks">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">Two Paths</span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Два направления,<br /><span className="italic text-[#775a19]">одна возможность</span></>
              ) : (
                <>Two tracks,<br /><span className="italic text-[#775a19]">one opportunity</span></>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
            {/* Beauty */}
            <div id="beauty" className="group relative overflow-hidden h-[720px]">
              <img src={beautyImage} alt="Beauty" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a]/95 via-[#1a1c1a]/40 to-[#1a1c1a]/20" />
              <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <p className="font-manrope text-[10px] tracking-[0.35em] uppercase text-[#c5a059]">01 · Beauty</p>
                </div>
                <div className="text-white max-w-md">
                  <h3 className="font-noto text-5xl md:text-6xl mb-6 leading-[0.95]" style={{ fontWeight: 400 }}>
                    {isRu ? 'Бьюти-сфера' : 'Beauty'}
                  </h3>
                  <p className="font-manrope text-sm text-white/80 mb-8 leading-relaxed">
                    {isRu
                      ? 'Нейл-мастера, лешмейкеры, парикмахеры, визажисты. Премиальные салоны с международной клиентурой.'
                      : 'Nail technicians, lash makers, hairstylists, makeup artists. Premium salons with international clientele.'}
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/20">
                    <div>
                      <p className="font-noto text-3xl text-[#c5a059]" style={{ fontWeight: 500 }}>$1 500–3 000</p>
                      <p className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">
                        {isRu ? 'в месяц' : 'per month'}
                      </p>
                    </div>
                    <div>
                      <p className="font-noto text-3xl text-[#c5a059]" style={{ fontWeight: 500 }}>
                        {isRu ? 'от 1 года' : '1+ years'}
                      </p>
                      <p className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">
                        {isRu ? 'опыта' : 'experience'}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-8 text-sm text-white/80">
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Жильё включено' : 'Housing included'}</li>
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Виза и перелёт' : 'Visa & flights'}</li>
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Официальный контракт' : 'Official contract'}</li>
                  </ul>
                  <a href="#quiz" className="inline-flex items-center gap-3 font-manrope text-xs tracking-[0.2em] uppercase text-[#c5a059] border-b border-[#c5a059] pb-1 hover:opacity-80 transition-all">
                    {isRu ? 'Подать заявку' : 'Apply'} →
                  </a>
                </div>
              </div>
            </div>

            {/* Service */}
            <div id="service" className="group relative overflow-hidden h-[720px]">
              <img src={hospitalityImage} alt="Hospitality" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a]/95 via-[#1a1c1a]/40 to-[#1a1c1a]/20" />
              <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <p className="font-manrope text-[10px] tracking-[0.35em] uppercase text-[#c5a059]">02 · Hospitality</p>
                </div>
                <div className="text-white max-w-md">
                  <h3 className="font-noto text-5xl md:text-6xl mb-6 leading-[0.95]" style={{ fontWeight: 400 }}>
                    {isRu ? 'Сфера сервиса' : 'Hospitality'}
                  </h3>
                  <p className="font-manrope text-sm text-white/80 mb-8 leading-relaxed">
                    {isRu
                      ? 'Хостес, официанты, ресепшн, администраторы. Работа в 5★ отелях и премиум-ресторанах. Можно без опыта.'
                      : 'Hostess, waiters, reception, administrators. Work at 5★ hotels and premium restaurants. No experience required.'}
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/20">
                    <div>
                      <p className="font-noto text-3xl text-[#c5a059]" style={{ fontWeight: 500 }}>$800–1 800</p>
                      <p className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">
                        {isRu ? '+ чаевые' : '+ tips'}
                      </p>
                    </div>
                    <div>
                      <p className="font-noto text-3xl text-[#c5a059]" style={{ fontWeight: 500 }}>
                        {isRu ? 'без опыта' : 'no experience'}
                      </p>
                      <p className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">
                        {isRu ? 'возможно' : 'possible'}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-8 text-sm text-white/80">
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Жильё и питание' : 'Housing & meals'}</li>
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Обучение на месте' : 'On-site training'}</li>
                    <li className="flex gap-3"><span className="text-[#c5a059]">✦</span>{isRu ? 'Медстраховка' : 'Medical insurance'}</li>
                  </ul>
                  <a href="#quiz" className="inline-flex items-center gap-3 font-manrope text-xs tracking-[0.2em] uppercase text-[#c5a059] border-b border-[#c5a059] pb-1 hover:opacity-80 transition-all">
                    {isRu ? 'Подать заявку' : 'Apply'} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DARK REQUIREMENTS BLOCK ========== */}
      <section className="py-28 md:py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#1a1c1a] text-[#faf9f6] p-12 md:p-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#c5a059]" />
                <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#c5a059] font-semibold">Requirements</span>
              </div>
              <h2 className="font-noto text-4xl md:text-5xl mb-10 leading-tight" style={{ fontWeight: 400 }}>
                {isRu ? (
                  <>Кому мы<br /><span className="italic">подходим</span></>
                ) : (
                  <>Who we<br /><span className="italic">work with</span></>
                )}
              </h2>
              <ul className="space-y-5 font-manrope text-base md:text-lg">
                {(isRu ? [
                  'Возраст от 18 лет',
                  'Опыт от 1 года (для бьюти) или без опыта (сервис)',
                  'Базовый английский приветствуется',
                  'Портфолио работ (для бьюти)',
                  'Загранпаспорт или готовность оформить',
                  'Желание работать и зарабатывать',
                ] : [
                  'Age 18+',
                  'From 1 year experience (beauty) or no experience (hospitality)',
                  'Basic English welcomed',
                  'Portfolio of work (for beauty)',
                  'International passport or willingness to get one',
                  'Desire to work and earn',
                ]).map((item, i) => (
                  <li key={i} className="flex gap-4 items-center opacity-90">
                    <span className="w-1.5 h-1.5 bg-[#c5a059] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block">
              <img src={portraitImage} alt="" className="w-full h-auto opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== REVIEWS ========== */}
      <section className="py-28 md:py-32 bg-[#f4f3f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">Voices</span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Истории, которые<br /><span className="italic text-[#775a19]">меняют всё</span></>
              ) : (
                <>Stories that<br /><span className="italic text-[#775a19]">change everything</span></>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#faf9f6] p-10 md:p-14 hover:bg-white transition-all duration-700">
                <p className="font-noto text-[#775a19] text-5xl mb-6 leading-none" style={{ fontWeight: 500 }}>❝</p>
                <p className="font-noto text-xl md:text-2xl italic leading-[1.4] text-[#1a1c1a] mb-8" style={{ fontWeight: 400 }}>
                  {r.text}
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-[#d1c5b4]/40">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059]/20 flex items-center justify-center">
                    <span className="font-noto text-[#775a19] text-sm" style={{ fontWeight: 500 }}>{r.initial}</span>
                  </div>
                  <div>
                    <p className="font-manrope font-bold text-sm text-[#1a1c1a]">{r.name}</p>
                    <p className="font-manrope text-[10px] tracking-[0.15em] uppercase text-[#7f7667] mt-0.5">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section className="py-28 md:py-32 bg-[#faf9f6]" id="process">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#775a19]" />
              <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">Process</span>
              <div className="w-12 h-px bg-[#775a19]" />
            </div>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>От заявки<br /><span className="italic text-[#775a19]">до вылета</span></>
              ) : (
                <>From application<br /><span className="italic text-[#775a19]">to departure</span></>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-4">
            {(isRu ? [
              { t: 'Заявка', d: 'Заполняете короткую анкету или пишете в WhatsApp' },
              { t: 'Проверка', d: 'Оцениваем ваш опыт и подбираем варианты' },
              { t: 'Вакансия', d: 'Предлагаем позицию с условиями и договором' },
              { t: 'Оформление', d: 'Помогаем с документами, визой и билетами' },
              { t: 'Вылет', d: 'Встречаем в аэропорту и помогаем адаптироваться' },
            ] : [
              { t: 'Application', d: 'Fill out a short form or message us on WhatsApp' },
              { t: 'Review', d: 'We assess your experience and suggest options' },
              { t: 'Vacancy', d: 'We offer a position with terms and contract' },
              { t: 'Processing', d: 'We help with documents, visa and tickets' },
              { t: 'Departure', d: 'We meet you at the airport and help you adapt' },
            ]).map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="font-noto text-5xl text-[#775a19] mb-4" style={{ fontWeight: 400 }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="w-8 h-px bg-[#d1c5b4] mb-4 mx-auto md:mx-0" />
                <h4 className="font-noto text-xl text-[#1a1c1a] mb-2" style={{ fontWeight: 500 }}>{s.t}</h4>
                <p className="font-manrope text-sm text-[#7f7667] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <FaqBlock isRu={isRu} t={t} />

      {/* ========== QUIZ ========== */}
      <QuizBlock isRu={isRu} t={t} />

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#efeeeb] w-full pt-20 md:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 w-full max-w-7xl mx-auto">
          <div className="space-y-6 md:col-span-1">
            <span className="font-noto italic text-2xl text-[#1a1c1a]">Legacy</span>
            <p className="font-manrope text-sm text-[#7f7667] leading-relaxed">
              {isRu
                ? 'Профессиональный подбор специалистов для работы за рубежом.'
                : 'Professional recruitment of specialists for work abroad.'}
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
              {isRu ? 'Контакты' : 'Contacts'}
            </p>
            <p className="font-manrope text-sm text-[#7f7667]">г. Бишкек,<br />Киевская 107, каб. 515</p>
            <a href="tel:+996707605575" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">+996 707 60 55 75</a>
            <a href="mailto:cv@legacygroup.work" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">cv@legacygroup.work</a>
            <p className="font-manrope text-xs text-[#7f7667]">{isRu ? 'пн–пт, 10:00–18:00' : 'Mon–Fri, 10:00–18:00'}</p>
          </div>
          <div className="space-y-3">
            <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
              {isRu ? 'Соцсети' : 'Social'}
            </p>
            <a href="https://wa.me/996707605575" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">WhatsApp</a>
            <a href="https://t.me/legacy_kg" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">Telegram</a>
            <a href="https://instagram.com/legacy.work.kg" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">Instagram</a>
          </div>
          <div className="space-y-3">
            <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
              {isRu ? 'Навигация' : 'Navigation'}
            </p>
            <a href="#destinations" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">{isRu ? 'Страны' : 'Countries'}</a>
            <a href="#tracks" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">{isRu ? 'Направления' : 'Tracks'}</a>
            <a href="#faq" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">FAQ</a>
            <a href="#quiz" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19]">{isRu ? 'Заявка' : 'Apply'}</a>
          </div>
        </div>
        <div className="mt-20 px-6 md:px-12 max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-manrope text-xs text-[#7f7667]">© 2026 Legacy. {isRu ? 'Все права защищены.' : 'All rights reserved.'}</span>
          <span className="font-manrope text-[10px] tracking-[0.2em] uppercase text-[#7f7667] italic">Editorial Edition</span>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/996707605575"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 satin-gradient rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}

// ========== FAQ BLOCK ==========
function FaqBlock({ isRu, t }) {
  const [openIndex, setOpenIndex] = useState(-1)
  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i)

  return (
    <section className="py-28 md:py-32 bg-[#f4f3f1]" id="faq">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#775a19]" />
            <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">FAQ</span>
            <div className="w-12 h-px bg-[#775a19]" />
          </div>
          <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Честные ответы<br /><span className="italic text-[#775a19]">на ваши сомнения</span></>
            ) : (
              <>Honest answers<br /><span className="italic text-[#775a19]">to your doubts</span></>
            )}
          </h2>
        </div>

        <div className="space-y-0">
          {t.faq.items.map((faq, i) => (
            <div key={i} className="border-b border-[#d1c5b4]/40">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between py-6 text-left transition-colors group"
              >
                <span className="font-noto text-lg md:text-xl text-[#1a1c1a] pr-6 group-hover:text-[#775a19] transition-colors" style={{ fontWeight: 500 }}>
                  {faq.q}
                </span>
                <span className={`font-noto text-2xl text-[#775a19] shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div className={`faq-content ${openIndex === i ? 'open pb-6' : ''}`}>
                <p className="font-manrope text-[#4e4639] leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== QUIZ BLOCK ==========
function QuizBlock({ isRu, t }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState(null)

  const totalSteps = t.quiz.steps.length + 1

  const handleOption = (value) => {
    setSelected(value)
    setAnswers((prev) => ({ ...prev, [`step${currentStep}`]: value }))
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setSelected(null)
    }, 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-28 md:py-32 bg-[#faf9f6]" id="quiz">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#775a19]" />
            <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
              {isRu ? 'Начать путь' : 'Start your journey'}
            </span>
            <div className="w-12 h-px bg-[#775a19]" />
          </div>
          <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a] leading-tight mb-6" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Узнайте, <span className="italic text-[#775a19]">подходите ли вы</span></>
            ) : (
              <>Find out <span className="italic text-[#775a19]">if you qualify</span></>
            )}
          </h2>
          <p className="font-manrope text-[#4e4639]">{t.quiz.subtitle}</p>
        </div>

        <div className="bg-white p-8 md:p-14">
          {/* Progress */}
          <div className="flex gap-1 mb-10">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-[#775a19]' : 'bg-[#d1c5b4]/40'}`}
              />
            ))}
          </div>

          {currentStep < t.quiz.steps.length && (
            <div key={currentStep} className="quiz-step-enter">
              <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-3">
                {isRu ? `Вопрос ${currentStep + 1} из ${t.quiz.steps.length}` : `Question ${currentStep + 1} of ${t.quiz.steps.length}`}
              </p>
              <p className="font-noto text-2xl md:text-3xl text-[#1a1c1a] mb-8 leading-tight" style={{ fontWeight: 500 }}>
                {t.quiz.steps[currentStep].question}
              </p>
              <div className="space-y-3">
                {t.quiz.steps[currentStep].options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleOption(opt)}
                    className={`w-full text-left p-5 border transition-all duration-300 ${
                      selected === opt
                        ? 'border-[#775a19] bg-[#faf9f6]'
                        : 'border-[#d1c5b4]/40 hover:border-[#775a19] hover:bg-[#faf9f6]'
                    }`}
                  >
                    <span className="font-manrope text-[#1a1c1a]">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === t.quiz.steps.length && !submitted && (
            <div className="quiz-step-enter">
              <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-3">
                {isRu ? 'Последний шаг' : 'Final step'}
              </p>
              <p className="font-noto text-2xl md:text-3xl text-[#1a1c1a] mb-3 leading-tight" style={{ fontWeight: 500 }}>
                {t.quiz.success}
              </p>
              <p className="font-manrope text-[#7f7667] text-sm mb-8">{t.quiz.successDesc}</p>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                    {t.quiz.namePlaceholder}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                  />
                </div>
                <div>
                  <label className="font-manrope text-[10px] uppercase tracking-[0.2em] text-[#775a19] mb-2 block">
                    {t.quiz.phonePlaceholder}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]"
                  />
                </div>
                <button
                  type="submit"
                  className="satin-gradient text-white w-full px-10 py-5 font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
                >
                  {t.quiz.submit}
                </button>
                <p className="text-center font-manrope text-[10px] text-[#7f7667]">{t.quiz.consent}</p>
              </form>
            </div>
          )}

          {submitted && (
            <div className="quiz-step-enter text-center py-8">
              <div className="w-16 h-16 border border-[#775a19] mx-auto mb-8 flex items-center justify-center">
                <span className="text-[#775a19] text-2xl">✓</span>
              </div>
              <p className="font-noto text-3xl text-[#1a1c1a] mb-4" style={{ fontWeight: 500 }}>{t.quiz.done}</p>
              <p className="font-manrope text-[#7f7667] mb-8">{t.quiz.doneDesc}</p>
              <a
                href="https://wa.me/996707605575"
                target="_blank"
                rel="noopener noreferrer"
                className="satin-gradient text-white inline-block px-10 py-4 font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
              >
                {t.quiz.doneBtn}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
