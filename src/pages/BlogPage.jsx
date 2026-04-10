import { useLang } from '../i18n'

const posts = {
  ru: [
    {
      category: 'Гайд',
      date: '2026',
      title: 'Как подготовиться к работе за границей',
      excerpt: 'Пошаговый гайд: от принятия решения до первого рабочего дня в новой стране. Документы, финансы, эмоциональная подготовка.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Советы',
      date: '2026',
      title: 'Работа за рубежом для пар',
      excerpt: 'Можно ли поехать вместе с партнёром? Какие есть варианты, что учесть и с чего начать.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Аналитика',
      date: 'Скоро',
      title: 'Сравнение зарплат: ОАЭ vs Катар vs Саудовская Аравия',
      excerpt: 'Где платят больше, где лучше условия — разбираем на реальных примерах из нашей базы.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Советы',
      date: 'Скоро',
      title: 'Что взять с собой при переезде',
      excerpt: 'Список вещей, документов и лайфхаков от тех, кто уже переехал. Что действительно пригодится.',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  en: [
    {
      category: 'Guide',
      date: '2026',
      title: 'How to prepare for working abroad',
      excerpt: 'Step-by-step guide: from decision to your first day at work in a new country. Documents, finances, emotional preparation.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Tips',
      date: '2026',
      title: 'Working abroad as a couple',
      excerpt: 'Can you go together with a partner? What options exist, what to consider, and where to start.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Analytics',
      date: 'Soon',
      title: 'Salary comparison: UAE vs Qatar vs Saudi Arabia',
      excerpt: 'Where do they pay more, where are conditions better — real examples from our database.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      category: 'Tips',
      date: 'Soon',
      title: 'What to pack when moving abroad',
      excerpt: 'List of things, documents and life hacks from those who already moved. What actually comes in handy.',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    },
  ],
}

export default function BlogPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const articles = posts[lang]

  return (
    <main style={{ background: '#faf9f6', color: '#1a1c1a' }} className="font-manrope">
      {/* HERO */}
      <section className="pt-40 pb-24 md:pt-48 md:pb-32 bg-[#faf9f6]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#775a19]" />
            <span className="font-manrope text-[11px] tracking-[0.25em] uppercase text-[#775a19] font-semibold">
              {isRu ? 'Блог' : 'Journal'}
            </span>
          </div>
          <h1 className="font-noto text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#1a1c1a] mb-8" style={{ fontWeight: 400 }}>
            {isRu ? (
              <>Журнал<br /><span className="italic text-[#775a19]">о работе за границей</span></>
            ) : (
              <>Journal<br /><span className="italic text-[#775a19]">on working abroad</span></>
            )}
          </h1>
          <p className="font-manrope text-lg md:text-xl text-[#4e4639] max-w-2xl leading-relaxed">
            {isRu
              ? 'Истории, гайды и советы от тех, кто уже сделал шаг. Честно, без прикрас, с деталями.'
              : 'Stories, guides and advice from those who already took the step. Honest, without embellishment, with details.'}
          </p>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="pb-28 md:pb-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {articles.map((post, i) => (
              <article
                key={i}
                className="group bg-[#f4f3f1] hover:bg-white transition-all duration-700 cursor-pointer"
              >
                <div className="relative h-[320px] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-[#faf9f6]/90 backdrop-blur-sm px-3 py-1.5">
                    <span className="font-manrope text-[10px] tracking-[0.2em] uppercase text-[#775a19] font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 md:p-12">
                  <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#7f7667] mb-4">
                    {String(i + 1).padStart(2, '0')} · {post.date}
                  </p>
                  <h3 className="font-noto text-3xl text-[#1a1c1a] mb-4 leading-tight group-hover:text-[#775a19] transition-colors" style={{ fontWeight: 500 }}>
                    {post.title}
                  </h3>
                  <p className="font-manrope text-[#4e4639] leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-3 font-manrope text-xs tracking-[0.2em] uppercase text-[#775a19] border-b border-[#775a19] pb-1">
                    {isRu ? 'Читать' : 'Read'} →
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* CTA to Telegram channel */}
          <div className="text-center mt-20">
            <p className="font-noto italic text-2xl md:text-3xl text-[#1a1c1a] mb-8" style={{ fontWeight: 400 }}>
              {isRu ? (
                <>Больше историй — в нашем <span className="text-[#775a19]">Telegram-канале</span></>
              ) : (
                <>More stories — on our <span className="text-[#775a19]">Telegram channel</span></>
              )}
            </p>
            <a
              href="https://t.me/legacy_kg"
              target="_blank"
              rel="noopener noreferrer"
              className="satin-gradient text-white inline-block px-12 py-5 font-manrope font-semibold tracking-[0.15em] uppercase text-xs transition-all hover:opacity-90"
            >
              {isRu ? 'Подписаться' : 'Subscribe'}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
