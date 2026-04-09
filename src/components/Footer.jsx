export default function Footer() {
  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="#" className="text-lg font-bold text-gray-900 inline-block mb-3">
              Legacy
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Профессиональный подбор и обучение специалистов для работы за рубежом. ОАЭ, Саудовская Аравия, Катар, Кувейт, Оман, Бахрейн.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Контакты</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>г. Бишкек, ул. Киевская 107, каб. 515</p>
              <a href="tel:+996707605575" className="block hover:text-brand-500 transition-colors">+996 707 60 55 75</a>
              <a href="mailto:cv@legacygroup.work" className="block hover:text-brand-500 transition-colors">cv@legacygroup.work</a>
              <p>пн–пт, 10:00–18:00</p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Мы в соцсетях</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/996707605575" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">WhatsApp</a>
              <a href="https://t.me/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Telegram</a>
              <a href="https://t.me/YOUR_CHANNEL" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Telegram-канал</a>
              <a href="https://instagram.com/legacy.group" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Instagram</a>
              <a href="https://facebook.com/legacygroup" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Facebook</a>
              <a href="https://linkedin.com/company/legacygroup" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">LinkedIn</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Навигация</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#beauty" className="block hover:text-brand-500 transition-colors">Бьюти-сфера</a>
              <a href="#service" className="block hover:text-brand-500 transition-colors">Сфера сервиса</a>
              <a href="/about" className="block hover:text-brand-500 transition-colors">О компании</a>
              <a href="/employers" className="block hover:text-brand-500 transition-colors">Работодателям</a>
              <a href="#faq" className="block hover:text-brand-500 transition-colors">Частые вопросы</a>
              <a href="#quiz" className="block hover:text-brand-500 transition-colors">Оставить заявку</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-300">&copy; 2026 Legacy. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
