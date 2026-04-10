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
import AtelierPreviewPage from './pages/AtelierPreviewPage'
import EditorialPreviewPage from './pages/EditorialPreviewPage'

function AppShell() {
  const location = useLocation()
  const standaloneRoutes = ['/preview-spa', '/preview-atelier', '/preview-editorial']
  const isStandalone = standaloneRoutes.includes(location.pathname)

  return (
    <>
      {!isStandalone && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/employers" element={<EmployersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/preview-spa" element={<SpaPreviewPage />} />
        <Route path="/preview-atelier" element={<AtelierPreviewPage />} />
        <Route path="/preview-editorial" element={<EditorialPreviewPage />} />
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
