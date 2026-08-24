import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Recipe } from '../data';
import RecipeCard from './RecipeCard';
import { useLang } from '../App';

const PAGE = 24;

/**
 * Paginated grid with true totals and URL-linkable page state (?page=N).
 * "Cargar más" reveals pages cumulatively; the URL always reflects the last
 * loaded page so state is shareable and crawlable.
 */
export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const urlPage = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  const [page, setPage] = useState(urlPage);

  useEffect(() => {
    setPage(Math.max(1, Math.min(urlPage, Math.ceil(recipes.length / PAGE) || 1)));
  }, [urlPage, recipes.length]);

  const shown = recipes.slice(0, page * PAGE);
  const remaining = recipes.length - shown.length;

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    const p = new URLSearchParams(params);
    p.set('page', String(next));
    setParams(p, { replace: true });
  };

  return (
    <div>
      <p className="text-sm text-ink/60 mb-4" role="status">
        {lang === 'es'
          ? `Mostrando ${shown.length} de ${recipes.length} recetas`
          : `Showing ${shown.length} of ${recipes.length} recipes`}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
      {remaining > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-medium rounded-full px-6 py-3 min-h-[44px]"
          >
            {lang === 'es' ? `Cargar más (${remaining} restantes)` : `Load more (${remaining} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}
