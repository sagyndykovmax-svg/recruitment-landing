import { ArrowRightIcon } from '../components/Icons'

const posts = [
  {
    title: 'Как подготовиться к работе за границей',
    excerpt: 'Пошаговый гайд: от принятия решения до первого рабочего дня в новой стране.',
    category: 'Гайд',
    date: '2026',
  },
  {
    title: 'Работа за рубежом для пар',
    excerpt: 'Можно ли поехать вместе с партнёром? Какие есть варианты и что учесть.',
    category: 'Советы',
    date: '2026',
  },
  {
    title: 'Сравнение зарплат: ОАЭ vs Саудовская Аравия vs Катар',
    excerpt: 'Где платят больше, где лучше условия — разбираем на реальных примерах.',
    category: 'Аналитика',
    date: 'Скоро',
  },
  {
    title: 'Что взять с собой при переезде',
    excerpt: 'Список вещей, документов и лайфхаков от тех, кто уже переехал.',
    category: 'Советы',
    date: 'Скоро',
  },
]

export default function BlogPage() {
  return (
    <main className="pt-20">
      <section className="py-20 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">Блог</h1>
          <p className="text-lg text-gray-500">Полезные статьи о работе и жизни за рубежом</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-brand-600 bg-brand-100 px-2.5 py-1 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm mb-4">Больше статей — скоро</p>
            <a href="https://t.me/YOUR_CHANNEL" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition-colors">
              Подписаться на Telegram-канал
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
