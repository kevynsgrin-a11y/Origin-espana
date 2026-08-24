import { useParams } from 'react-router-dom';
import { recipes, categoryBySlug, regionBySlug } from '../data';
import { categoryIntros, regionIntros } from './hubIntros';
import RecipeGrid from '../components/RecipeGrid';
import NotFound from './NotFound';
import { useLang } from '../App';

export default function Hub({ kind }: { kind: 'category' | 'region' }) {
  const { slug } = useParams();
  const { lang } = useLang();
  const taxon = slug ? (kind === 'category' ? categoryBySlug.get(slug) : regionBySlug.get(slug)) : undefined;
  if (!taxon) return <NotFound />;

  const list = recipes.filter((r) =>
    kind === 'category' ? r.category?.slug === taxon.slug : r.region?.slug === taxon.slug
  );
  const intro = (kind === 'category' ? categoryIntros : regionIntros)[taxon.slug] || [];
  const hero = list[0]?.image;

  return (
    <>
      <div className="relative bg-wine text-white">
        {hero && (
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero})` }}
            aria-hidden="true"
          />
        )}
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <p className="text-xs tracking-[0.25em] uppercase text-white/70">
            {kind === 'category'
              ? lang === 'es' ? 'Categoría' : 'Category'
              : lang === 'es' ? 'Cocina regional' : 'Regional cuisine'}
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl">
            {kind === 'category' ? `Recetas de ${taxon.name}` : `Cocina de ${taxon.name}`}
          </h1>
          <p className="mt-3 text-white/80">
            {lang === 'es' ? `${list.length} recetas tradicionales` : `${list.length} traditional recipes`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {intro.length > 0 && (
          <div lang="es" className="max-w-3xl mt-10 space-y-4 text-ink/80 leading-relaxed">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        <div className="mt-10">
          <RecipeGrid recipes={list} />
        </div>
      </div>
    </>
  );
}
