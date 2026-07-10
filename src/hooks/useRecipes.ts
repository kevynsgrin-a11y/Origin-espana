import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe, Category, Region } from '../types';

const PAGE_SIZE = 10;

export interface FeedFilters {
  query: string;
  region: string;
  trendingTier: string;
  category: string;
}

const EMPTY_FILTERS: FeedFilters = { query: '', region: '', trendingTier: '', category: '' };

export function useFilteredFeed(filters: FeedFilters = EMPTY_FILTERS) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const filtersRef = useRef(filters);

  const buildQuery = useCallback((page: number, f: FeedFilters) => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let q = supabase
      .from('recipes')
      .select('*, category:categories(*), region:regions(*)');

    if (f.query.trim()) {
      q = q.textSearch('fts', f.query.trim(), { type: 'websearch', config: 'spanish' });
    }

    if (f.region) {
      q = q.eq('region_id', f.region);
    }

    if (f.trendingTier) {
      q = q.eq('trending_tier', f.trendingTier);
    }

    if (f.category) {
      q = q.eq('category_id', f.category);
    }

    q = q.order('view_count', { ascending: false }).range(from, to);
    return q;
  }, []);

  useEffect(() => {
    filtersRef.current = filters;
    pageRef.current = 0;
    setHasMore(true);

    const load = async () => {
      setLoading(true);
      const { data } = await buildQuery(0, filters);
      const results = (data || []) as Recipe[];
      setRecipes(results);
      if (results.length < PAGE_SIZE) setHasMore(false);
      setLoading(false);
    };

    const timer = setTimeout(load, filters.query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [filters.query, filters.region, filters.trendingTier, filters.category, buildQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    const { data } = await buildQuery(nextPage, filtersRef.current);
    const results = (data || []) as Recipe[];
    if (results.length < PAGE_SIZE) setHasMore(false);
    setRecipes(prev => [...prev, ...results]);
    setLoadingMore(false);
  }, [loadingMore, hasMore, buildQuery]);

  return { recipes, loading, loadingMore, hasMore, loadMore };
}

export function useFeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*, category:categories(*), region:regions(*)')
        .eq('is_featured', true)
        .order('share_count', { ascending: false })
        .limit(4);

      setRecipes((data || []) as Recipe[]);
      setLoading(false);
    };
    load();
  }, []);

  return { recipes, loading };
}

export function useRecipe(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*, category:categories(*), region:regions(*)')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRecipe(data as Recipe | null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  return { recipe, loading, error };
}

export function useRelatedRecipes(recipe: Recipe | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!recipe) return;
    const load = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*, category:categories(*), region:regions(*)')
        .eq('category_id', recipe.category_id)
        .neq('id', recipe.id)
        .limit(3);

      setRecipes((data || []) as Recipe[]);
    };
    load();
  }, [recipe]);

  return recipes;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      setCategories((data || []) as Category[]);
    };
    load();
  }, []);

  return categories;
}

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('regions')
        .select('*')
        .order('name');
      setRegions((data || []) as Region[]);
    };
    load();
  }, []);

  return regions;
}

export async function incrementShareCount(recipeId: string) {
  await supabase.rpc('increment_share_count', { recipe_id: recipeId });
}

export async function incrementViewCount(recipeId: string) {
  await supabase.rpc('increment_view_count', { recipe_id: recipeId });
}
