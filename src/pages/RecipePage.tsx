import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Users, Gauge, Share2, Check } from 'lucide-react';
import { recipeBySlug, recipes, totalTime, difficultyLabel, SITE } from '../data';
import RecipeCard from '../components/RecipeCard';
import NotFound from './NotFound';
import { useLang } from '../App';

export default function RecipePage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const recipe = slug ? recipeBySlug.get(slug) : undefined;
  if (!recipe) return <NotFound />;

  const tt = totalTime(recipe);
  const related = recipes
    .filter((r) => r.id !== recipe.id && (r.category?.slug === recipe.category?.slug || r.region?.slug === recipe.region?.slug))
    .slice(0, 3);

  const share = async () => {
    const url = `${SITE}/receta/${recipe.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="relative bg-wine text-white">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            width={1260}
            height={750}
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="relative max-w-6xl mx-auto px-4 pt-6 pb-14 min-h-[420px] flex flex-col justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-cream/90 text-ink text-sm font-medium rounded-full px-4 py-2 w-fit hover:bg-cream min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {lang === 'es' ? 'Volver' : 'Back'}
          </Link>
          <div lang="es">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.region && (
                <Link to={`/regiones/${recipe.region.slug}`} className="bg-cream/90 text-ink text-xs font-medium rounded-full px-3 py-1.5 hover:bg-cream">
                  {recipe.region.name}
                </Link>
              )}
              {recipe.category && (
                <Link to={`/recetas/${recipe.category.slug}`} className="bg-cream/90 text-ink text-xs font-medium rounded-full px-3 py-1.5 hover:bg-cream">
                  {recipe.category.name}
                </Link>
              )}
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl drop-shadow">{recipe.title}</h1>
            {recipe.subtitle && <p className="mt-2 italic text-white/85 text-lg">{recipe.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-b border-ink/10">
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {tt != null && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-terracotta" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink/50">{lang === 'es' ? 'Tiempo total' : 'Total time'}</dt>
                  <dd className="text-sm font-medium">{tt} min</dd>
                </div>
              </div>
            )}
            {recipe.prep_time != null && (
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-terracotta" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink/50">{lang === 'es' ? 'Preparación' : 'Prep time'}</dt>
                  <dd className="text-sm font-medium">{recipe.prep_time} min</dd>
                </div>
              </div>
            )}
            {recipe.servings != null && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-terracotta" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink/50">{lang === 'es' ? 'Raciones' : 'Servings'}</dt>
                  <dd className="text-sm font-medium">{recipe.servings}</dd>
                </div>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-terracotta" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink/50">{lang === 'es' ? 'Dificultad' : 'Difficulty'}</dt>
                  <dd className="text-sm font-medium">{difficultyLabel[recipe.difficulty] || recipe.difficulty}</dd>
                </div>
              </div>
            )}
          </dl>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-terracotta min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
            {copied ? (lang === 'es' ? 'Enlace copiado' : 'Link copied') : lang === 'es' ? 'Compartir' : 'Share'}
          </button>
        </div>

        <div lang="es">
          {recipe.description && <p className="mt-6 italic text-ink/70">“{recipe.description}”</p>}

          <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_1.4fr]">
            <section aria-labelledby="ing-heading">
              <h2 id="ing-heading" className="font-display font-bold text-2xl">Ingredientes</h2>
              <ul className="mt-4 space-y-2.5">
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" aria-hidden="true" />
                    <span>
                      {i.amount && <strong className="font-medium">{i.amount} </strong>}
                      {i.name}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="steps-heading">
              <h2 id="steps-heading" className="font-display font-bold text-2xl">Elaboración</h2>
              <ol className="mt-4 space-y-4">
                {recipe.steps.map((s, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-terracotta/10 text-terracotta text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-relaxed pt-1">{s}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {recipe.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {recipe.tags.map((t) => (
                <span key={t} className="bg-ink/5 text-ink/70 text-xs rounded-full px-3 py-1.5">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display font-bold text-2xl mb-6">
            {lang === 'es' ? 'También te puede gustar' : 'You may also like'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
