import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeById } from '../data';
import NotFound from './NotFound';

/**
 * Client-side fallback for legacy /recipe/:id URLs. Server-side 301s are
 * handled by the generated _redirects file on Cloudflare Pages; this route
 * covers SPA navigations only.
 */
export default function RedirectOldRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = id ? recipeById.get(id) : undefined;
  useEffect(() => {
    if (recipe) navigate(`/receta/${recipe.slug}`, { replace: true });
  }, [recipe, navigate]);
  if (!recipe) return <NotFound />;
  return null;
}
