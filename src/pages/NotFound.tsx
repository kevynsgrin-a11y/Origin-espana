import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLang } from '../App';

export default function NotFound() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="font-display font-bold text-7xl text-terracotta">404</p>
      <h1 className="mt-4 font-display font-bold text-3xl">
        {lang === 'es' ? 'Página no encontrada' : 'Page not found'}
      </h1>
      <p className="mt-3 text-ink/60">
        {lang === 'es'
          ? 'La página que buscas no existe o ha cambiado de dirección. Prueba a buscar la receta o vuelve al inicio.'
          : 'The page you are looking for does not exist or has moved. Try searching for the recipe or go back home.'}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          to="/"
          className="bg-terracotta hover:bg-terracotta-dark text-white font-medium rounded-full px-6 py-3 min-h-[44px] inline-flex items-center"
        >
          {lang === 'es' ? 'Ir al inicio' : 'Go home'}
        </Link>
        <Link
          to="/search"
          className="border border-ink/15 hover:border-terracotta font-medium rounded-full px-6 py-3 min-h-[44px] inline-flex items-center gap-2"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {lang === 'es' ? 'Buscar recetas' : 'Search recipes'}
        </Link>
      </div>
    </div>
  );
}
