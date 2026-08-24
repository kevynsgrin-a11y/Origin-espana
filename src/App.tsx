import { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RecipePage from './pages/RecipePage';
import Search from './pages/Search';
import Hub from './pages/Hub';
import StaticPage from './pages/StaticPage';
import NotFound from './pages/NotFound';
import RedirectOldRecipe from './pages/RedirectOldRecipe';
import { getPageMeta } from './seo';

export type Lang = 'es' | 'en';
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'es',
  setLang: () => {},
});
// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);

function usePageMetaSync() {
  const location = useLocation();
  useEffect(() => {
    const meta = getPageMeta(location.pathname);
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.canonical) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = meta.canonical;
    } else if (link) {
      link.remove();
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

export default function App() {
  const [lang, setLangState] = useState<Lang>('es');
  useEffect(() => {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'en') setLangState('en');
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem('lang', l);
  };
  usePageMetaSync();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <a href="#main" className="sr-only sr-only-focusable bg-terracotta text-white rounded">
        {lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/receta/:slug" element={<RecipePage />} />
          <Route path="/recipe/:id" element={<RedirectOldRecipe />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recetas/:slug" element={<Hub kind="category" />} />
          <Route path="/regiones/:slug" element={<Hub kind="region" />} />
          <Route path="/sobre-nosotros" element={<StaticPage page="sobre-nosotros" />} />
          <Route path="/contacto" element={<StaticPage page="contacto" />} />
          <Route path="/privacidad" element={<StaticPage page="privacidad" />} />
          <Route path="/cookies" element={<StaticPage page="cookies" />} />
          <Route path="/aviso-legal" element={<StaticPage page="aviso-legal" />} />
          <Route path="/estandares" element={<StaticPage page="estandares" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
