import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { recipes, searchRecipes, categories, regions, categoryBySlug, regionBySlug } from '../data';
import RecipeGrid from '../components/RecipeGrid';
import { useLang } from '../App';

export default function Search() {
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const catSlug = params.get('category') || '';
  const regSlug = params.get('region') || '';
  const cat = catSlug ? categoryBySlug.get(catSlug) : undefined;
  const reg = regSlug ? regionBySlug.get(regSlug) : undefined;

  const results = useMemo(() => {
    let list = recipes;
    if (cat) list = list.filter((r) => r.category?.slug === cat.slug);
    if (reg) list = list.filter((r) => r.region?.slug === reg.slug);
    return searchRecipes(q, list);
  }, [q, cat, reg]);

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    setParams(p, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl">{lang === 'es' ? 'Buscar recetas' : 'Search recipes'}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label htmlFor="q" className="sr-only">
            {lang === 'es' ? 'Buscar recetas por nombre o ingrediente' : 'Search recipes by name or ingredient'}
          </label>
          <input
            id="q"
            type="search"
            value={q}
            onChange={(e) => update('q', e.target.value)}
            placeholder={lang === 'es' ? 'Busca por nombre o ingrediente…' : 'Search by name or ingredient…'}
            className="w-full border border-ink/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-terracotta"
          />
        </div>
        <div>
          <label htmlFor="cat" className="sr-only">{lang === 'es' ? 'Categoría' : 'Category'}</label>
          <select
            id="cat"
            value={catSlug}
            onChange={(e) => update('category', e.target.value)}
            className="w-full border border-ink/15 rounded-xl px-4 py-3 bg-white min-h-[44px]"
          >
            <option value="">{lang === 'es' ? 'Todas las categorías' : 'All categories'}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reg" className="sr-only">{lang === 'es' ? 'Región' : 'Region'}</label>
          <select
            id="reg"
            value={regSlug}
            onChange={(e) => update('region', e.target.value)}
            className="w-full border border-ink/15 rounded-xl px-4 py-3 bg-white min-h-[44px]"
          >
            <option value="">{lang === 'es' ? 'Todas las regiones' : 'All regions'}</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {(cat || reg || q) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink/60">{lang === 'es' ? 'Filtros activos:' : 'Active filters:'}</span>
          {q && (
            <button onClick={() => update('q', '')} className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta rounded-full px-3 py-1.5 hover:bg-terracotta/20 min-h-[36px]">
              “{q}” <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          {cat && (
            <button onClick={() => update('category', '')} className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta rounded-full px-3 py-1.5 hover:bg-terracotta/20 min-h-[36px]">
              {cat.name} <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          {reg && (
            <button onClick={() => update('region', '')} className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta rounded-full px-3 py-1.5 hover:bg-terracotta/20 min-h-[36px]">
              {reg.name} <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          <Link to="/search" className="text-terracotta underline">
            {lang === 'es' ? 'Limpiar todo' : 'Clear all'}
          </Link>
        </div>
      )}

      <div className="mt-8">
        {results.length > 0 ? (
          <RecipeGrid recipes={results} />
        ) : (
          <p className="text-ink/60 py-12 text-center">
            {lang === 'es'
              ? 'No se encontraron recetas con esos criterios. Prueba con otro término.'
              : 'No recipes matched those criteria. Try another term.'}
          </p>
        )}
      </div>
    </div>
  );
}
