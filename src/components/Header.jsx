import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLang()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navItems = [
    { to: '/', label: lang === 'ru' ? 'Главная' : 'Home' },
    { to: '/about', label: lang === 'ru' ? 'О нас' : 'About' },
    { to: '/employers', label: lang === 'ru' ? 'Работодателям' : 'Employers' },
    { to: '/blog', label: lang === 'ru' ? 'Блог' : 'Blog' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">Legacy</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm transition-colors ${location.pathname === item.to ? 'text-brand-500 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>

          {/* CTA */}
          <a href="/#quiz" className="hidden sm:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            {lang === 'ru' ? 'Оставить заявку' : 'Apply'}
          </a>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block text-sm py-2 ${location.pathname === item.to ? 'text-brand-500 font-semibold' : 'text-gray-600'}`}
              >
                {item.label}
              </Link>
            ))}
            <a href="/#quiz" className="block bg-brand-500 text-white text-center font-semibold py-3 rounded-xl text-sm mt-2">
              {lang === 'ru' ? 'Оставить заявку' : 'Apply'}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
