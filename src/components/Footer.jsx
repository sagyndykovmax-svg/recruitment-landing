import { useLang } from '../i18n'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer

  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <a href="#" className="text-lg font-bold text-gray-900 inline-block mb-3">Legacy</a>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">{f.contacts}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>г. Бишкек, ул. Киевская 107, каб. 515</p>
              <a href="tel:+996707605575" className="block hover:text-brand-500 transition-colors">+996 707 60 55 75</a>
              <a href="mailto:cv@legacygroup.work" className="block hover:text-brand-500 transition-colors">cv@legacygroup.work</a>
              <p>пн–пт, 10:00–18:00</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">{f.socials}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/996707605575" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">WhatsApp</a>
              <a href="https://t.me/datamanager312" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Telegram</a>
              <a href="https://t.me/legacy_kg" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">{f.tgChannel}</a>
              <a href="https://instagram.com/legacy.work.kg" target="_blank" rel="noopener noreferrer" className="block hover:text-brand-500 transition-colors">Instagram</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">{f.nav}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#beauty" className="block hover:text-brand-500 transition-colors">{f.beautyLink}</a>
              <a href="#service" className="block hover:text-brand-500 transition-colors">{f.serviceLink}</a>
              <a href="/about" className="block hover:text-brand-500 transition-colors">{f.aboutLink}</a>
              <a href="/employers" className="block hover:text-brand-500 transition-colors">{f.employersLink}</a>
              <a href="#faq" className="block hover:text-brand-500 transition-colors">{f.faqLink}</a>
              <a href="#quiz" className="block hover:text-brand-500 transition-colors">{f.applyLink}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-300">&copy; 2026 Legacy. {f.rights}</p>
        </div>
      </div>
    </footer>
  )
}
