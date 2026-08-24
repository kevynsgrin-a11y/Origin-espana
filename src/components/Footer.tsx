import { Link } from 'react-router-dom';
import { categories, regions } from '../data';
import { useLang } from '../App';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mt-20 bg-wine text-white/85">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display font-bold text-xl text-white">Origen España</p>
          <p className="mt-3 text-sm leading-relaxed">
            {lang === 'es'
              ? 'Recetario tradicional español y catalán. Sin anuncios invasivos, sin seguimiento.'
              : 'Traditional Spanish and Catalan recipe archive. No invasive ads, no tracking.'}
          </p>
        </div>
        <nav aria-label={lang === 'es' ? 'Categorías' : 'Categories'}>
          <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            {lang === 'es' ? 'Categorías' : 'Categories'}
          </p>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/recetas/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={lang === 'es' ? 'Regiones' : 'Regions'}>
          <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            {lang === 'es' ? 'Regiones' : 'Regions'}
          </p>
          <ul className="space-y-2 text-sm">
            {regions.map((r) => (
              <li key={r.slug}>
                <Link to={`/regiones/${r.slug}`} className="hover:text-white">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={lang === 'es' ? 'Información' : 'Information'}>
          <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            {lang === 'es' ? 'Información' : 'Information'}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link to="/privacidad" className="hover:text-white">Política de privacidad</Link></li>
            <li><Link to="/cookies" className="hover:text-white">Política de cookies</Link></li>
            <li><Link to="/aviso-legal" className="hover:text-white">Aviso legal</Link></li>
            <li><Link to="/estandares" className="hover:text-white">Nuestros estándares editoriales</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/60">
          © {new Date().getFullYear()} Origen España · originespana.com
        </p>
      </div>
    </footer>
  );
}
