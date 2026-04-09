export default function Footer() {
  return (
    <footer className="py-10 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <a href="#" className="text-lg font-bold text-gray-900 inline-block mb-4">
          Legacy
        </a>
        <p className="text-sm text-gray-400 mb-6">Рекрутинговое агентство по трудоустройству за рубежом</p>
        <div className="flex justify-center gap-6 mb-6">
          <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">
            WhatsApp
          </a>
          <a href="https://t.me/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">
            Telegram
          </a>
        </div>
        <p className="text-xs text-gray-300">&copy; 2026 Legacy. Все права защищены.</p>
      </div>
    </footer>
  )
}
