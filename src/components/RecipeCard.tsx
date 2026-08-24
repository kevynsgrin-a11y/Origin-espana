import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import { Recipe, totalTime, difficultyLabel } from '../data';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const tt = totalTime(recipe);
  return (
    <article className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow border border-ink/5">
      <Link to={`/receta/${recipe.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-ink/5">
          <img
            src={recipe.image}
            alt={recipe.title}
            width={600}
            height={400}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {recipe.difficulty && (
              <span className="bg-cream/95 text-ink text-xs font-medium rounded-full px-2.5 py-1">
                {difficultyLabel[recipe.difficulty] || recipe.difficulty}
              </span>
            )}
            {recipe.region && (
              <span className="bg-white/95 text-ink text-xs font-medium rounded-full px-2.5 py-1">
                {recipe.region.name}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-lg leading-snug group-hover:text-terracotta transition-colors">
            {recipe.title}
          </h3>
          {recipe.subtitle && <p className="mt-1 text-sm text-ink/60 line-clamp-2">{recipe.subtitle}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-ink/60">
            {tt != null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {tt} min
              </span>
            )}
            {recipe.servings != null && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" aria-hidden="true" /> {recipe.servings}
              </span>
            )}
            {recipe.category && <span>{recipe.category.name}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
