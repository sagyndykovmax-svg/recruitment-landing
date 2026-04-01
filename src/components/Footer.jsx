export default function Footer() {
  return (
    <footer className="py-10 bg-dark-900 text-white/50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <a href="#" className="text-lg font-bold text-white inline-block mb-4">
          <span className="text-brand-400">Global</span>Staff
        </a>
        <p className="text-sm mb-6">Рекрутинговое агентство по трудоустройству за рубежом</p>
        <div className="flex justify-center gap-6 mb-6">
          <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            WhatsApp
          </a>
          <a href="https://t.me/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Telegram
          </a>
        </div>
        <p className="text-xs">&copy; 2026 GlobalStaff. Все права защищены.</p>
      </div>
    </footer>
  )
}
