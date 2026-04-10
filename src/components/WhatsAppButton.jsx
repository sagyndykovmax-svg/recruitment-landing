import { useEffect, useState } from 'react'
import { WhatsAppIcon } from './Icons'
import { useLang } from '../i18n'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)
  const { lang } = useLang()
  const isRu = lang === 'ru'

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 4000)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <a
        href="https://wa.me/996707605575"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 satin-gradient rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>
      <div
        className={`fixed bottom-8 right-24 z-50 bg-[#1a1c1a] text-[#faf9f6] font-manrope text-xs tracking-wide px-4 py-2.5 shadow-lg transition-opacity duration-300 pointer-events-none ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        {isRu ? 'Напишите нам — ответим за 5 минут' : "Message us — we'll reply in 5 minutes"}
      </div>
    </>
  )
}
