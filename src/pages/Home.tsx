import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { recipes, categories, regions } from '../data';
import RecipeGrid from '../components/RecipeGrid';
import { useLang } from '../App';

export default function Home() {
  const { lang } = useLang();
  const featured = recipes.filter((r) => r.featured);
  const ordered = [...featured, ...recipes.filter((r) => !r.featured)];

  return (
    <>
      <section className="relative bg-wine text-white">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: featured[0]?.image ? `url(${featured[0].image})` : undefined }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <p className="text-xs tracking-[0.25em] uppercase text-white/70">
            {lang === 'es' ? 'Cocina tradicional española y catalana' : 'Traditional Spanish & Catalan cuisine'}
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-6xl max-w-3xl leading-tight">
            {lang === 'es' ? 'Recetas de siempre, con todo el sabor de antes' : 'Timeless recipes, with all the flavors of the past'}
          </h1>
          <p className="mt-6 max-w-xl text-white/80">
            {lang === 'es'
              ? 'Descubre los platos que cocinaban nuestras abuelas. Sabores auténticos que despiertan nostalgia.'
              : 'Discover the dishes our grandmothers cooked with love. Authentic flavors that awaken nostalgia.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-cream text-ink font-medium rounded-xl px-5 py-3 hover:bg-white min-h-[44px]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {lang === 'es' ? 'Explorar recetas' : 'Explore recipes'}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-14" aria-labelledby="cats-heading">
        <h2 id="cats-heading" className="font-display font-bold text-2xl">
          {lang === 'es' ? 'Explora por categoría' : 'Browse by category'}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/recetas/${c.slug}`}
              className="border border-ink/15 rounded-full px-4 py-2 text-sm font-medium hover:border-terracotta hover:text-terracotta min-h-[44px] inline-flex items-center"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <h2 className="font-display font-bold text-2xl mt-8">
          {lang === 'es' ? 'Explora por región' : 'Browse by region'}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {regions.map((r) => (
            <Link
              key={r.slug}
              to={`/regiones/${r.slug}`}
              className="border border-ink/15 rounded-full px-4 py-2 text-sm font-medium hover:border-terracotta hover:text-terracotta min-h-[44px] inline-flex items-center"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </section>

      <section id="explorar" className="max-w-6xl mx-auto px-4 mt-14" aria-labelledby="all-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 id="all-heading" className="font-display font-bold text-3xl">
              {lang === 'es' ? 'Todas las recetas' : 'All recipes'}
            </h2>
            <p className="text-sm text-ink/60 mt-1">
              {lang === 'es' ? 'El recetario completo, empezando por las destacadas' : 'The full collection, featured first'}
            </p>
          </div>
          <Link to="/search" className="text-sm font-medium text-terracotta hover:text-terracotta-dark">
            {lang === 'es' ? 'Búsqueda avanzada →' : 'Advanced search →'}
          </Link>
        </div>
        <RecipeGrid recipes={ordered} />
      </section>
    </>
  );
}
