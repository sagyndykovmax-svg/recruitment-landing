import { createContext, useContext, useState } from 'react'

const translations = {
  ru: {
    nav: {
      home: 'Главная',
      vacancies: 'Вакансии',
      employers: 'Работодателям',
      about: 'О нас',
      blog: 'Блог',
      faq: 'Вопросы',
      apply: 'Оставить заявку',
    },
    hero: {
      badge: '350+ людей уже трудоустроены',
      title1: 'Работа за границей',
      title2: 'в сфере сервиса и красоты',
      subtitle: 'Вакансии в ОАЭ, Саудовской Аравии, Катаре, Кувейте, Омане и Бахрейне',
      desc: 'Бьюти-мастера и работа с гостями — отели, рестораны, хостес',
      choose: 'Выберите направление:',
      beauty: 'Я мастер (бьюти)',
      beautyDesc: 'Ногти, ресницы, волосы',
      service: 'Работа с гостями',
      serviceDesc: 'Можно без опыта',
      cta: 'Оставить заявку',
      whatsapp: 'Написать в WhatsApp',
      stats: { placed: 'трудоустроены', countries: 'стран', years: 'на рынке' },
    },
  },
  en: {
    nav: {
      home: 'Home',
      vacancies: 'Vacancies',
      employers: 'For Employers',
      about: 'About',
      blog: 'Blog',
      faq: 'FAQ',
      apply: 'Apply Now',
    },
    hero: {
      badge: '350+ people placed',
      title1: 'Work Abroad',
      title2: 'in beauty & hospitality',
      subtitle: 'Vacancies in UAE, Saudi Arabia, Qatar, Kuwait, Oman & Bahrain',
      desc: 'Beauty specialists & guest-facing roles — hotels, restaurants, hostess',
      choose: 'Choose your track:',
      beauty: 'Beauty specialist',
      beautyDesc: 'Nails, lashes, hair',
      service: 'Hospitality',
      serviceDesc: 'No experience needed',
      cta: 'Apply Now',
      whatsapp: 'WhatsApp Us',
      stats: { placed: 'placed', countries: 'countries', years: 'in business' },
    },
  },
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ru')
  const t = translations[lang]
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
