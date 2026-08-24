import content from './generated/content.json';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Taxon {
  name: string;
  slug: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  image: string;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: string;
  tags: string[];
  featured: boolean;
  category: Taxon | null;
  region: Taxon | null;
  created_at: string | null;
  updated_at: string | null;
  search: string;
}

interface Content {
  recipes: Recipe[];
  categories: Taxon[];
  regions: Taxon[];
}

const data = content as unknown as Content;

export const SITE = 'https://originespana.com';
export const SITE_NAME = 'Origen España';

export const recipes = data.recipes;
export const categories = data.categories;
export const regions = data.regions;

export const recipeBySlug = new Map(recipes.map((r) => [r.slug, r]));
export const recipeById = new Map(recipes.map((r) => [r.id, r]));
export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
export const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

export function totalTime(r: Recipe): number | null {
  if (r.prep_time == null && r.cook_time == null) return null;
  return (r.prep_time || 0) + (r.cook_time || 0);
}

export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Accent-insensitive search across title, subtitle, description, ingredients and tags. */
export function searchRecipes(query: string, list: Recipe[] = recipes): Recipe[] {
  const terms = fold(query).split(' ').filter(Boolean);
  if (terms.length === 0) return list;
  return list.filter((r) => terms.every((t) => r.search.includes(t)));
}

export const difficultyLabel: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Media',
  dificil: 'Difícil',
};
