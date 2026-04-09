import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './i18n'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EmployersPage from './pages/EmployersPage'
import BlogPage from './pages/BlogPage'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </BrowserRouter>
    </LangProvider>
  )
}
