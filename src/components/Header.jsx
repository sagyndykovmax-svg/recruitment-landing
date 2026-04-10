import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLang()
  const location = useLocation()
  const isRu = lang === 'ru'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navItems = [
    { to: '/', label: isRu ? 'Главная' : 'Home' },
    { to: '/about', label: isRu ? 'О нас' : 'About' },
    { to: '/employers', label: isRu ? 'Работодателям' : 'Employers' },
    { to: '/blog', label: isRu ? 'Блог' : 'Blog' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#faf9f6]/90 backdrop-blur-md' : 'bg-[#faf9f6]/70 backdrop-blur-md'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="font-noto italic text-xl md:text-2xl tracking-tight text-[#1a1c1a]">
          Legacy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-noto uppercase tracking-[0.2em] text-[11px] transition-colors ${
                location.pathname === item.to
                  ? 'text-[#775a19]'
                  : 'text-[#7f7667] hover:text-[#775a19]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {/* Language toggle */}
          <button
            onClick={() => setLang(isRu ? 'en' : 'ru')}
            className="font-manrope text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7f7667] hover:text-[#775a19] transition-colors"
          >
            {isRu ? 'EN' : 'RU'}
          </button>

          {/* CTA */}
          <Link
            to="/#quiz"
            className="hidden sm:inline font-noto uppercase tracking-[0.2em] text-[11px] text-[#775a19] border-b border-[#775a19] pb-1 hover:opacity-80 transition-all"
          >
            {isRu ? 'Оставить заявку' : 'Apply'}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-6 h-6 flex flex-col justify-center gap-1.5"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-px bg-[#1a1c1a] transition-all ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`}
            />
            <span
              className={`block w-6 h-px bg-[#1a1c1a] transition-all ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#faf9f6]">
          <nav className="max-w-screen-2xl mx-auto px-6 py-8 space-y-5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block font-noto text-2xl ${
                  location.pathname === item.to ? 'text-[#775a19]' : 'text-[#1a1c1a]'
                }`}
                style={{ fontWeight: 400 }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/#quiz"
              className="inline-block satin-gradient text-white font-manrope font-semibold tracking-[0.15em] uppercase text-xs px-8 py-4 mt-4"
            >
              {isRu ? 'Оставить заявку' : 'Apply now'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
