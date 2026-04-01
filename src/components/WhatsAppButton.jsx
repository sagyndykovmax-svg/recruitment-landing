import { useEffect, useState } from 'react'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)

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
        href="https://wa.me/YOUR_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 wa-pulse"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>
      <div
        className={`fixed bottom-6 right-24 z-50 bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg transition-opacity duration-300 pointer-events-none ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        Напишите нам — ответим за 5 минут
      </div>
    </>
  )
}
