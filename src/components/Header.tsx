import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Search, Globe } from 'lucide-react';
import { useLang } from '../App';

export default function Header() {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="Origen España — inicio">
          <ChefHat className="w-7 h-7 text-terracotta" aria-hidden="true" />
          <span>
            <span className="block font-display font-bold text-lg leading-tight">Origen España</span>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60">
              {lang === 'es' ? 'Cocina tradicional' : 'Traditional cuisine'}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6" aria-label={lang === 'es' ? 'Principal' : 'Main'}>
          <Link to="/#explorar" className="text-sm font-medium text-terracotta hover:text-terracotta-dark hidden sm:block">
            {lang === 'es' ? 'Descubrir' : 'Discover'}
          </Link>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-terracotta min-h-[44px]"
            aria-label={lang === 'es' ? 'Buscar recetas' : 'Search recipes'}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{lang === 'es' ? 'Buscar' : 'Search'}</span>
          </button>
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-sm font-medium border border-ink/15 rounded-full px-3 py-1.5 hover:border-terracotta min-h-[44px]"
            aria-label={lang === 'es' ? 'Switch interface to English' : 'Cambiar interfaz a español'}
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            {lang.toUpperCase()}
          </button>
        </nav>
      </div>
    </header>
  );
}
