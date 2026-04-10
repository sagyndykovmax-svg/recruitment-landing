import { useState } from 'react'

// Free Unsplash stock photos — warm beauty/spa aesthetic
const heroImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80'
const nailsImage = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
const spaImage = 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80'
const hotelImage = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
const dubaiImage = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80'

// Avatars for "+345 already in system" strip
const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
]

export default function SpaPreviewPage() {
  const [activeTrack, setActiveTrack] = useState(null)

  return (
    <div style={{ background: '#FDFBF7', color: '#2B2825' }} className="min-h-screen">
      {/* Preview notice */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#2B2825] text-[#FDFBF7] text-center py-2 text-xs tracking-wider">
        PREVIEW · SPA EDITORIAL CONCEPT · <a href="/" className="underline">← вернуться на сайт</a>
      </div>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-end overflow-hidden pt-8">
        {/* Background image with Ken Burns */}
        <div className="absolute inset-0 ken-burns">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) saturate(0.9)' }}
          />
        </div>
        {/* Warm overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(253,251,247,0.1) 0%, rgba(43,40,37,0.4) 60%, rgba(43,40,37,0.85) 100%)' }} />

        {/* Editorial label top-left */}
        <div className="absolute top-12 left-8 md:left-16 z-10 editorial-fade">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-[#FDFBF7]/60" />
            <span className="text-[#FDFBF7]/70 tracking-[0.3em] text-xs uppercase font-sans">
              Legacy · Since 2023
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full px-8 md:px-16 pb-20 md:pb-28">
          <div className="max-w-5xl">
            {/* Kicker */}
            <p className="text-[#FDFBF7]/70 text-sm md:text-base tracking-[0.2em] uppercase mb-6 font-sans editorial-fade" style={{ animationDelay: '0.2s' }}>
              Issue №01 — Работа за границей
            </p>

            {/* Serif title */}
            <h1
              className="font-serif text-[#FDFBF7] leading-[0.95] mb-8 editorial-fade"
              style={{
                fontSize: 'clamp(2.75rem, 7vw, 6rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                animationDelay: '0.4s',
              }}
            >
              Работа, <em style={{ fontStyle: 'italic', color: '#F5E6DE' }}>которая меняет</em><br />
              жизнь
            </h1>

            {/* Subtitle */}
            <p className="text-[#FDFBF7]/80 text-lg md:text-xl max-w-2xl mb-10 font-sans leading-relaxed editorial-fade" style={{ animationDelay: '0.6s' }}>
              350+ девушек из СНГ уже работают в ОАЭ, Катаре, Кувейте, Саудовской Аравии, Омане и Бахрейне. Честное трудоустройство, прозрачные условия, поддержка на каждом шаге.
            </p>

            {/* Pill buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12 editorial-fade" style={{ animationDelay: '0.8s' }}>
              <button
                onClick={() => setActiveTrack('beauty')}
                className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-500 ${
                  activeTrack === 'beauty'
                    ? 'bg-[#C89B7B] text-[#FDFBF7] scale-105'
                    : 'bg-[#FDFBF7] text-[#2B2825] hover:bg-[#F5E6DE]'
                }`}
              >
                <span>Я мастер</span>
                <span className="text-xs opacity-60">бьюти-сфера</span>
              </button>
              <button
                onClick={() => setActiveTrack('service')}
                className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-500 ${
                  activeTrack === 'service'
                    ? 'bg-[#C89B7B] text-[#FDFBF7] scale-105'
                    : 'bg-transparent border border-[#FDFBF7]/40 text-[#FDFBF7] hover:bg-[#FDFBF7]/10'
                }`}
              >
                <span>Я без опыта</span>
                <span className="text-xs opacity-60">сфера сервиса</span>
              </button>
            </div>

            {/* Avatar strip */}
            <div className="flex items-center gap-4 editorial-fade" style={{ animationDelay: '1s' }}>
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-[#FDFBF7] object-cover"
                  />
                ))}
              </div>
              <p className="text-[#FDFBF7]/80 text-sm font-sans">
                <span className="text-[#F5E6DE] font-medium">+ 345 девушек</span> уже в системе
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-10 editorial-fade" style={{ animationDelay: '1.2s' }}>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[#FDFBF7]/60 tracking-[0.2em] text-xs uppercase writing-mode-vertical font-sans" style={{ writingMode: 'vertical-rl' }}>
              Scroll
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-[#FDFBF7]/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ========== EDITORIAL INTRO ========== */}
      <section className="py-32 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#C89B7B]" />
            <span className="text-[#C89B7B] tracking-[0.3em] text-xs uppercase font-sans">
              Chapter 01
            </span>
          </div>

          <p
            className="font-serif text-[#2B2825] leading-[1.15] mb-12"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 400 }}
          >
            Это не про «уехать любой ценой». Это про то, <em style={{ color: '#C89B7B' }}>чтобы ехать осознанно</em> — с понятным контрактом, реальными условиями и человеком, который рядом.
          </p>

          <div className="grid md:grid-cols-3 gap-12 mt-20">
            <div>
              <p className="font-serif text-[#C89B7B] text-5xl mb-3" style={{ fontWeight: 500 }}>350+</p>
              <p className="text-sm tracking-wider uppercase text-[#2B2825]/60 font-sans">Трудоустроены</p>
            </div>
            <div>
              <p className="font-serif text-[#C89B7B] text-5xl mb-3" style={{ fontWeight: 500 }}>6</p>
              <p className="text-sm tracking-wider uppercase text-[#2B2825]/60 font-sans">Стран</p>
            </div>
            <div>
              <p className="font-serif text-[#C89B7B] text-5xl mb-3" style={{ fontWeight: 500 }}>3 года</p>
              <p className="text-sm tracking-wider uppercase text-[#2B2825]/60 font-sans">На рынке</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MAGAZINE SPREAD ========== */}
      <section className="py-20 px-8 md:px-16 bg-[#F5E6DE]/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-px bg-[#C89B7B]" />
            <span className="text-[#C89B7B] tracking-[0.3em] text-xs uppercase font-sans">
              Featured · История Жазгуль
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <img
                src={nailsImage}
                alt="Nail art"
                className="w-full rounded-sm shadow-2xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
            </div>
            <div className="md:col-span-5">
              <p className="font-serif text-[#2B2825] leading-[1.2] mb-6" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', fontWeight: 400 }}>
                <em style={{ color: '#C89B7B' }}>«</em>Работаю в Дубае уже полгода. Сначала было страшно, но команда Legacy помогла на каждом этапе<em style={{ color: '#C89B7B' }}>»</em>
              </p>
              <div className="w-12 h-px bg-[#C89B7B] mb-4" />
              <p className="font-sans text-sm tracking-wider uppercase text-[#2B2825]/70">
                Жазгуль · Nail master · Dubai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section className="py-32 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-px bg-[#C89B7B]" />
            <span className="text-[#C89B7B] tracking-[0.3em] text-xs uppercase font-sans">
              Chapter 02 · Что внутри
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-sm aspect-[4/5] group cursor-pointer">
              <img src={spaImage} alt="Beauty" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2825]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#F5E6DE]/80 mb-2">01</p>
                <h3 className="font-serif text-[#FDFBF7] text-3xl md:text-4xl mb-2" style={{ fontWeight: 400 }}>
                  Бьюти-сфера
                </h3>
                <p className="text-[#FDFBF7]/80 text-sm font-sans">$1 500–3 000 · Премиальные салоны</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-sm aspect-[4/5] group cursor-pointer">
              <img src={hotelImage} alt="Hospitality" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2825]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#F5E6DE]/80 mb-2">02</p>
                <h3 className="font-serif text-[#FDFBF7] text-3xl md:text-4xl mb-2" style={{ fontWeight: 400 }}>
                  Сфера сервиса
                </h3>
                <p className="text-[#FDFBF7]/80 text-sm font-sans">$800–1 800 · Отели, рестораны</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-32 px-8 md:px-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={dubaiImage} alt="" className="w-full h-full object-cover ken-burns" style={{ filter: 'brightness(0.5)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2B2825]/60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-sans text-[#F5E6DE]/80 text-sm tracking-[0.3em] uppercase mb-6">
            Готова начать?
          </p>
          <h2 className="font-serif text-[#FDFBF7] leading-[1] mb-10" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400 }}>
            Твоя история <em style={{ color: '#F5E6DE' }}>начинается здесь</em>
          </h2>
          <button className="bg-[#FDFBF7] hover:bg-[#F5E6DE] text-[#2B2825] font-sans font-medium tracking-wide text-sm px-12 py-5 rounded-full transition-all duration-500 hover:scale-105">
            Оставить заявку
          </button>
          <p className="text-[#FDFBF7]/60 text-xs font-sans mt-6 tracking-wider">
            Ответим в WhatsApp в течение 2 часов
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 px-8 md:px-16 bg-[#2B2825] text-[#FDFBF7]/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif text-2xl text-[#FDFBF7]" style={{ fontWeight: 500 }}>Legacy</p>
          <p className="text-xs tracking-[0.2em] uppercase font-sans">
            Spa Editorial Preview · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
