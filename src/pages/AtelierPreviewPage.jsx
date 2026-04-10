import { useState } from 'react'

// Stock images (Unsplash, free)
const heroImage = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=80'
const beautyImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'
const hospitalityImage = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
const apartmentImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
const portraitImage = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80'

const countries = [
  {
    code: 'UAE',
    name: 'ОАЭ',
    city: 'Дубай · Абу-Даби',
    desc: 'Эпицентр мировых бьюти-трендов. Работа в премиальных салонах и 5★ отелях Дубая.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    offset: 0,
  },
  {
    code: 'QA',
    name: 'Катар',
    city: 'Доха',
    desc: 'Утончённая роскошь и культурное наследие. Элитные wellness-центры Дохи.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    offset: 48,
  },
  {
    code: 'KW',
    name: 'Кувейт',
    city: 'Эль-Кувейт',
    desc: 'Высокий доход и состоятельная клиентура. Комфортный климат для жизни.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    offset: 96,
  },
  {
    code: 'SA',
    name: 'Саудовская Аравия',
    city: 'Эр-Рияд · Джидда',
    desc: 'Быстрорастущий рынок с уникальными возможностями и высокими зарплатами.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    offset: 0,
  },
  {
    code: 'OM',
    name: 'Оман',
    city: 'Маскат',
    desc: 'Тихая гавань Залива. Размеренный ритм и высокий уровень жизни.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    offset: 48,
  },
  {
    code: 'BH',
    name: 'Бахрейн',
    city: 'Манама',
    desc: 'Финансовый хаб региона. Международная атмосфера и лояльные работодатели.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    offset: 96,
  },
]

const benefits = [
  { icon: '✦', title: 'Зарплата без налогов', desc: 'Вся заработанная сумма остаётся у вас — никаких вычетов и скрытых сборов.' },
  { icon: '✦', title: 'Премиальное жильё', desc: 'Меблированная квартира рядом с работой. Все коммунальные услуги включены.' },
  { icon: '✦', title: 'Авиабилеты', desc: 'Оплаченный ежегодный перелёт домой к семье и друзьям.' },
  { icon: '✦', title: 'Полная страховка', desc: 'Частная медицинская и страховая защита с первого дня контракта.' },
]

const reviews = [
  {
    name: 'Жазгуль',
    role: 'Nail Master · Дубай',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    text: 'Работаю в Дубае уже полгода. Сначала было страшно, но команда Legacy помогла на каждом этапе — от оформления документов до адаптации на месте.',
  },
  {
    name: 'Маргарита',
    role: 'Hairstylist · Доха',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'Поддержка Legacy была безупречной. Виза, жильё, контракт — всё организовали. Работаю в красивейшем салоне Дохи. За 4 месяца накопила больше, чем за год дома.',
  },
]

export default function AtelierPreviewPage() {
  const [activeTrack, setActiveTrack] = useState('beauty')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ background: '#faf9f6', color: '#1a1c1a' }} className="min-h-screen font-manrope">
      {/* Preview notice */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1c1a] text-[#faf9f6] text-center py-2 text-xs tracking-[0.2em] uppercase">
        Preview · Atelier Concept · <a href="/" className="underline">← вернуться на сайт</a>
      </div>

      {/* ========== NAV ========== */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-[#faf9f6]/70 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto">
          <span className="font-noto italic text-xl tracking-tighter text-[#1a1c1a]">Legacy</span>
          <div className="hidden md:flex gap-10">
            <a className="font-noto uppercase tracking-widest text-xs text-[#7f7667] hover:text-[#775a19] transition-colors" href="#destinations">Направления</a>
            <a className="font-noto uppercase tracking-widest text-xs text-[#7f7667] hover:text-[#775a19] transition-colors" href="#benefits">Условия</a>
            <a className="font-noto uppercase tracking-widest text-xs text-[#7f7667] hover:text-[#775a19] transition-colors" href="#process">Процесс</a>
            <a className="font-noto uppercase tracking-widest text-xs text-[#7f7667] hover:text-[#775a19] transition-colors" href="#apply">О нас</a>
          </div>
          <a href="#apply" className="font-noto uppercase tracking-widest text-xs text-[#775a19] border-b border-[#775a19] pb-1 hover:opacity-80 transition-all">
            Оставить заявку
          </a>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#faf9f6]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full pt-24">
          <div className="space-y-8">
            <span className="font-manrope text-sm tracking-[0.2em] uppercase text-[#775a19] font-semibold block">
              The Curated Atelier · Since 2023
            </span>
            <h1 className="font-noto text-5xl md:text-7xl leading-[1.05] text-[#1a1c1a]">
              Ваша карьера<br />
              <span className="italic">в индустрии красоты</span>
            </h1>
            <p className="font-manrope text-lg text-[#4e4639] max-w-md leading-relaxed">
              Мы соединяем специалистов из стран СНГ с самыми престижными спа-центрами, салонами и отелями Ближнего Востока.
            </p>

            {/* Track selector */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTrack('beauty')}
                className={`font-manrope text-xs tracking-[0.15em] uppercase transition-all duration-300 pb-1 ${
                  activeTrack === 'beauty'
                    ? 'text-[#775a19] border-b-2 border-[#775a19]'
                    : 'text-[#7f7667] border-b border-transparent hover:text-[#775a19]'
                }`}
              >
                Бьюти-сфера
              </button>
              <button
                onClick={() => setActiveTrack('hospitality')}
                className={`font-manrope text-xs tracking-[0.15em] uppercase transition-all duration-300 pb-1 ${
                  activeTrack === 'hospitality'
                    ? 'text-[#775a19] border-b-2 border-[#775a19]'
                    : 'text-[#7f7667] border-b border-transparent hover:text-[#775a19]'
                }`}
              >
                Сфера сервиса
              </button>
            </div>

            <div className="pt-6">
              <a
                href="#apply"
                className="satin-gradient text-white px-10 py-5 inline-block font-manrope font-semibold tracking-wider uppercase text-sm transition-all hover:opacity-90 hover:shadow-xl"
              >
                Оставить заявку
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-12 pt-8">
              <div>
                <p className="font-noto text-3xl text-[#775a19]">350+</p>
                <p className="font-manrope text-xs tracking-widest uppercase text-[#7f7667] mt-1">Трудоустроены</p>
              </div>
              <div>
                <p className="font-noto text-3xl text-[#775a19]">6</p>
                <p className="font-manrope text-xs tracking-widest uppercase text-[#7f7667] mt-1">Стран</p>
              </div>
              <div>
                <p className="font-noto text-3xl text-[#775a19]">3 года</p>
                <p className="font-manrope text-xs tracking-widest uppercase text-[#7f7667] mt-1">На рынке</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DESTINATIONS ========== */}
      <section className="py-32 bg-[#faf9f6]" id="destinations">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-6">
            <div>
              <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] font-semibold block mb-4">Destinations</span>
              <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a]">Шесть направлений<br /><span className="italic">залива</span></h2>
            </div>
            <p className="font-manrope text-[#4e4639] max-w-sm">
              Испытайте стиль жизни в самых динамичных бьюти- и сервис-хабах мира.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {countries.map((c, i) => (
              <div
                key={i}
                className="group relative overflow-hidden h-[500px] bg-[#f4f3f1] transition-all duration-700 hover:bg-white cursor-pointer"
                style={{ marginTop: `${c.offset}px` }}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-[#1a1c1a]/80 via-[#1a1c1a]/10 to-transparent">
                  <p className="font-manrope text-xs tracking-[0.3em] uppercase text-[#c5a059] mb-2">{c.code}</p>
                  <h3 className="font-noto text-3xl text-white mb-2">{c.name}</h3>
                  <p className="font-manrope text-xs tracking-wider text-white/80 mb-4">{c.city}</p>
                  <p className="font-manrope text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-32 overflow-hidden">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENEFITS ========== */}
      <section className="py-32 bg-[#f4f3f1]" id="benefits">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] font-semibold mb-6 block">
                Unrivalled Benefits
              </span>
              <h2 className="font-noto text-4xl md:text-5xl leading-tight mb-12 text-[#1a1c1a]">
                Стандарт жизни,<br /><span className="italic">который меняет всё</span>
              </h2>
              <div className="grid grid-cols-1 gap-10">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-12 h-12 border border-[#d1c5b4] flex items-center justify-center group-hover:bg-[#775a19] group-hover:border-[#775a19] transition-all duration-500">
                      <span className="text-[#775a19] group-hover:text-white text-xl transition-colors">{b.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-manrope font-semibold text-lg mb-2 text-[#1a1c1a]">{b.title}</h4>
                      <p className="text-[#4e4639] text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={apartmentImage}
                alt=""
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-10 -left-10 bg-[#faf9f6] p-12 hidden lg:block">
                <p className="font-noto italic text-2xl text-[#775a19] leading-relaxed">
                  «Уровень жизни,<br />превзошедший<br />ожидания.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TWO TRACKS ========== */}
      <section className="py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] font-semibold mb-4 block">Two Paths</span>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a]">
              Два направления,<br /><span className="italic">одна возможность</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Beauty track */}
            <div className="group relative overflow-hidden h-[700px] bg-[#f4f3f1]">
              <img
                src={beautyImage}
                alt="Beauty"
                className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-1000 group-hover:opacity-90 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a]/90 via-[#1a1c1a]/30 to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-between">
                <div>
                  <p className="font-manrope text-xs tracking-[0.3em] uppercase text-[#c5a059] mb-2">01 · Beauty</p>
                </div>
                <div className="text-white">
                  <h3 className="font-noto text-5xl mb-4 leading-tight">Бьюти-сфера</h3>
                  <p className="font-manrope text-sm text-white/80 mb-6 max-w-md leading-relaxed">
                    Нейл-мастера, лешмейкеры, парикмахеры, визажисты. Работа в премиальных салонах с международной клиентурой.
                  </p>
                  <div className="flex gap-8 mb-8">
                    <div>
                      <p className="font-noto text-2xl text-[#c5a059]">$1 500–3 000</p>
                      <p className="font-manrope text-xs tracking-wider uppercase text-white/60 mt-1">в месяц</p>
                    </div>
                    <div>
                      <p className="font-noto text-2xl text-[#c5a059]">от 1 года</p>
                      <p className="font-manrope text-xs tracking-wider uppercase text-white/60 mt-1">опыта</p>
                    </div>
                  </div>
                  <a href="#apply" className="inline-block font-manrope text-xs tracking-[0.2em] uppercase text-[#c5a059] border-b border-[#c5a059] pb-1 hover:opacity-80 transition-all">
                    Подать заявку →
                  </a>
                </div>
              </div>
            </div>

            {/* Hospitality track */}
            <div className="group relative overflow-hidden h-[700px] bg-[#f4f3f1]">
              <img
                src={hospitalityImage}
                alt="Hospitality"
                className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-1000 group-hover:opacity-90 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a]/90 via-[#1a1c1a]/30 to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-between">
                <div>
                  <p className="font-manrope text-xs tracking-[0.3em] uppercase text-[#c5a059] mb-2">02 · Hospitality</p>
                </div>
                <div className="text-white">
                  <h3 className="font-noto text-5xl mb-4 leading-tight">Сфера сервиса</h3>
                  <p className="font-manrope text-sm text-white/80 mb-6 max-w-md leading-relaxed">
                    Хостес, официанты, ресепшн, администраторы. Работа в 5★ отелях и премиум-ресторанах. Можно без опыта.
                  </p>
                  <div className="flex gap-8 mb-8">
                    <div>
                      <p className="font-noto text-2xl text-[#c5a059]">$800–1 800</p>
                      <p className="font-manrope text-xs tracking-wider uppercase text-white/60 mt-1">+ чаевые</p>
                    </div>
                    <div>
                      <p className="font-noto text-2xl text-[#c5a059]">без опыта</p>
                      <p className="font-manrope text-xs tracking-wider uppercase text-white/60 mt-1">возможно</p>
                    </div>
                  </div>
                  <a href="#apply" className="inline-block font-manrope text-xs tracking-[0.2em] uppercase text-[#c5a059] border-b border-[#c5a059] pb-1 hover:opacity-80 transition-all">
                    Подать заявку →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== REQUIREMENTS — dark feature block ========== */}
      <section className="py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#1a1c1a] text-[#faf9f6] p-12 md:p-24 flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#c5a059] mb-6 block">Requirements</span>
              <h2 className="font-noto text-4xl mb-8 leading-tight">
                Кто нам<br /><span className="italic">подходит</span>
              </h2>
              <ul className="space-y-6 font-manrope text-lg">
                <li className="flex gap-4 items-center">
                  <span className="w-1.5 h-1.5 bg-[#c5a059]" />
                  Возраст от 18 лет
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-1.5 h-1.5 bg-[#c5a059]" />
                  Опыт от 1 года (для бьюти) или без опыта (для сервиса)
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-1.5 h-1.5 bg-[#c5a059]" />
                  Базовый английский (приветствуется)
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-1.5 h-1.5 bg-[#c5a059]" />
                  Портфолио работ (для бьюти)
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-1.5 h-1.5 bg-[#c5a059]" />
                  Загранпаспорт или готовность оформить
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src={portraitImage}
                alt=""
                className="w-full h-auto grayscale opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== REVIEWS ========== */}
      <section className="py-32 bg-[#f4f3f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] font-semibold mb-4 block">Success Stories</span>
            <h2 className="font-noto text-4xl md:text-5xl text-[#1a1c1a]">Реальные<br /><span className="italic">истории</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#faf9f6] p-12 hover:shadow-xl transition-all duration-500">
                <p className="font-noto text-[#775a19] text-3xl mb-6 leading-none">❝</p>
                <p className="font-noto text-xl italic leading-relaxed text-[#1a1c1a] mb-8">
                  {r.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e3e2e0]">
                    <img src={r.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-manrope font-bold text-sm text-[#1a1c1a]">{r.name}</h5>
                    <p className="font-manrope text-xs text-[#7f7667]">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== APPLY FORM ========== */}
      <section className="py-32 bg-[#faf9f6]" id="apply">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] font-semibold mb-4 block">Start Your Journey</span>
            <h2 className="font-noto text-4xl md:text-5xl mb-6 text-[#1a1c1a]">Начните<br /><span className="italic">свою историю</span></h2>
            <p className="font-manrope text-[#4e4639] max-w-xl mx-auto">
              Коротко расскажите о себе — наши консультанты свяжутся в течение 2 часов, чтобы обсудить подходящие вакансии.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <label className="font-manrope text-xs uppercase tracking-widest text-[#775a19] mb-2 block">Имя</label>
                  <input
                    type="text"
                    required
                    placeholder="Как вас зовут"
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope placeholder:text-[#d1c5b4]"
                  />
                </div>
                <div className="relative">
                  <label className="font-manrope text-xs uppercase tracking-widest text-[#775a19] mb-2 block">Специальность</label>
                  <input
                    type="text"
                    placeholder="Например: нейл-мастер, официантка"
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope placeholder:text-[#d1c5b4]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <label className="font-manrope text-xs uppercase tracking-widest text-[#775a19] mb-2 block">WhatsApp / Телефон</label>
                  <input
                    type="tel"
                    required
                    placeholder="+996 ..."
                    className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope placeholder:text-[#d1c5b4]"
                  />
                </div>
                <div className="relative">
                  <label className="font-manrope text-xs uppercase tracking-widest text-[#775a19] mb-2 block">Страна мечты</label>
                  <select className="w-full bg-transparent border-0 border-b border-[#d1c5b4] focus:border-[#775a19] focus:outline-none transition-all py-3 font-manrope text-[#1a1c1a]">
                    <option value="">Выберите</option>
                    <option>ОАЭ</option>
                    <option>Катар</option>
                    <option>Кувейт</option>
                    <option>Саудовская Аравия</option>
                    <option>Оман</option>
                    <option>Бахрейн</option>
                    <option>Не знаю — подскажите</option>
                  </select>
                </div>
              </div>
              <div className="text-center pt-8">
                <button
                  type="submit"
                  className="satin-gradient text-white px-16 py-5 font-manrope font-semibold tracking-wider uppercase text-sm transition-all hover:opacity-90"
                >
                  Отправить заявку
                </button>
                <p className="font-manrope text-xs text-[#7f7667] mt-6">
                  Ответим в WhatsApp в течение 2 часов
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 border border-[#775a19] mx-auto mb-8 flex items-center justify-center">
                <span className="text-[#775a19] text-2xl">✓</span>
              </div>
              <h3 className="font-noto text-3xl text-[#1a1c1a] mb-4">Заявка отправлена</h3>
              <p className="font-manrope text-[#4e4639]">Мы свяжемся с вами в WhatsApp в течение 2 часов.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#efeeeb] w-full pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 w-full max-w-7xl mx-auto">
          <div className="space-y-8">
            <span className="font-noto italic text-2xl text-[#1a1c1a]">Legacy</span>
            <p className="font-manrope text-sm text-[#7f7667] max-w-xs">
              Премиальное направление для бьюти-специалистов и работников сферы сервиса в самые роскошные рынки мира.
            </p>
            <div className="space-y-2 font-manrope text-sm text-[#7f7667]">
              <p>г. Бишкек, ул. Киевская 107, каб. 515</p>
              <a href="tel:+996707605575" className="block hover:text-[#775a19] transition-colors">+996 707 60 55 75</a>
              <a href="mailto:cv@legacygroup.work" className="block hover:text-[#775a19] transition-colors">cv@legacygroup.work</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-manrope text-xs font-bold uppercase tracking-widest text-[#775a19]">Навигация</span>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="#destinations">Направления</a>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="#benefits">Условия</a>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="#apply">Заявка</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-manrope text-xs font-bold uppercase tracking-widest text-[#775a19]">Соцсети</span>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="https://wa.me/996707605575">WhatsApp</a>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="https://t.me/legacy_kg">Telegram</a>
              <a className="font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-all" href="https://instagram.com/legacy.work.kg">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-24 px-6 md:px-12 max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-manrope text-xs text-[#7f7667]">© 2026 Legacy. All Rights Reserved.</span>
          <span className="font-manrope text-xs text-[#7f7667] italic">The Curated Atelier</span>
        </div>
      </footer>
    </div>
  )
}
