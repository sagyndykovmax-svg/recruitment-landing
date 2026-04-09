export default function Footer() {
  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="#" className="text-lg font-bold text-gray-900 inline-block mb-3">
              Legacy
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Рекрутинговое агентство по трудоустройству за рубежом. Помогаем найти работу в ОАЭ, Саудовской Аравии, Катаре и Кувейте.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Контакты</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                WhatsApp
              </a>
              <a href="https://t.me/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                Telegram
              </a>
              <a href="https://t.me/YOUR_CHANNEL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                Telegram-канал (вакансии и отзывы)
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Навигация</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#beauty" className="block hover:text-brand-500 transition-colors">Бьюти-сфера</a>
              <a href="#service" className="block hover:text-brand-500 transition-colors">Сфера сервиса</a>
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
