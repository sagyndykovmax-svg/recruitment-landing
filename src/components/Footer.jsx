import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

export default function Footer() {
  const { lang } = useLang()
  const isRu = lang === 'ru'

  return (
    <footer className="bg-[#efeeeb] w-full pt-20 md:pt-24 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="space-y-6 md:col-span-1">
          <Link to="/" className="font-noto italic text-2xl text-[#1a1c1a]">Legacy</Link>
          <p className="font-manrope text-sm text-[#7f7667] leading-relaxed">
            {isRu
              ? 'Профессиональный подбор специалистов для работы за рубежом. С 2019 года.'
              : 'Professional recruitment of specialists for work abroad. Since 2019.'}
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
            {isRu ? 'Контакты' : 'Contacts'}
          </p>
          <p className="font-manrope text-sm text-[#7f7667] leading-relaxed">
            {isRu ? 'г. Бишкек,' : 'Bishkek,'}<br />
            {isRu ? 'ул. Киевская 107, каб. 515' : '107 Kievskaya St., office 515'}
          </p>
          <a href="tel:+996707605575" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            +996 707 60 55 75
          </a>
          <a href="mailto:cv@legacygroup.work" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            cv@legacygroup.work
          </a>
          <p className="font-manrope text-xs text-[#7f7667]">
            {isRu ? 'пн–пт, 10:00–18:00' : 'Mon–Fri, 10:00–18:00'}
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
            {isRu ? 'Соцсети' : 'Social'}
          </p>
          <a
            href="https://wa.me/996707605575"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://t.me/legacy_kg"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://instagram.com/legacy.work.kg"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors"
          >
            Instagram
          </a>
        </div>

        <div className="space-y-3">
          <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a19]">
            {isRu ? 'Навигация' : 'Navigation'}
          </p>
          <Link to="/" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            {isRu ? 'Главная' : 'Home'}
          </Link>
          <Link to="/about" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            {isRu ? 'О нас' : 'About'}
          </Link>
          <Link to="/employers" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            {isRu ? 'Работодателям' : 'Employers'}
          </Link>
          <Link to="/blog" className="block font-manrope text-sm text-[#7f7667] hover:text-[#775a19] transition-colors">
            {isRu ? 'Блог' : 'Blog'}
          </Link>
        </div>
      </div>

      <div className="mt-20 px-6 md:px-12 max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-manrope text-xs text-[#7f7667]">
          © 2026 Legacy. {isRu ? 'Все права защищены.' : 'All rights reserved.'}
        </span>
        <span className="font-manrope text-[10px] tracking-[0.2em] uppercase text-[#7f7667] italic">
          Since 2019
        </span>
      </div>
    </footer>
  )
}
