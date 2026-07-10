export interface Recipe {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  region_id: string | null;
  category_id: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: 'facil' | 'medio' | 'dificil' | null;
  ingredients: Ingredient[];
  steps: Step[];
  image_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
  share_count: number;
  view_count: number;
  is_featured: boolean;
  trending_tier: 'top_100' | 'top_200' | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  region?: Region;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  order: number;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
}
