import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LangProvider } from './i18n'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EmployersPage from './pages/EmployersPage'
import BlogPage from './pages/BlogPage'
import SpaPreviewPage from './pages/SpaPreviewPage'

function AppShell() {
  const location = useLocation()
  const isStandalone = location.pathname === '/preview-spa'

  return (
    <>
      {!isStandalone && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/employers" element={<EmployersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/preview-spa" element={<SpaPreviewPage />} />
      </Routes>
      {!isStandalone && <Footer />}
      {!isStandalone && <WhatsAppButton />}
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppShell />
      </BrowserRouter>
    </LangProvider>
  )
}
