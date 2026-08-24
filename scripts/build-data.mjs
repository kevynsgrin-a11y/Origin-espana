// Build-time data pipeline.
// Reads the committed Supabase snapshot in /data (optionally refreshed via
// SUPABASE_URL + SUPABASE_ANON_KEY env vars), computes stable slugs, joins
// categories/regions, and emits src/generated/content.json for the app and
// the prerenderer.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function loadTable(name) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    const res = await fetch(`${url}/rest/v1/${name}?select=*&limit=1000`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      const rows = await res.json();
      writeFileSync(join(root, 'data', `${name}.json`), JSON.stringify(rows, null, 1));
      console.log(`refreshed ${name} from Supabase (${rows.length} rows)`);
      return rows;
    }
    console.warn(`Supabase fetch for ${name} failed (${res.status}); using snapshot`);
  }
  return JSON.parse(readFileSync(join(root, 'data', `${name}.json`), 'utf8'));
}

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const [recipes, categories, regions] = await Promise.all([
  loadTable('recipes'),
  loadTable('categories'),
  loadTable('regions'),
]);

const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const regById = Object.fromEntries(regions.map((r) => [r.id, r]));

// Deterministic slugs with dedupe (e.g. duplicate "Crema Catalana").
const seen = new Map();
const sorted = [...recipes].sort((a, b) =>
  (a.created_at || '').localeCompare(b.created_at || '') || a.id.localeCompare(b.id)
);
const slugById = new Map();
for (const r of sorted) {
  const base = slugify(r.title);
  const n = (seen.get(base) || 0) + 1;
  seen.set(base, n);
  slugById.set(r.id, n === 1 ? base : `${base}-${n}`);
}

const outRecipes = recipes.map((r) => {
  const cat = catById[r.category_id] || null;
  const reg = regById[r.region_id] || null;
  return {
    id: r.id,
    slug: slugById.get(r.id),
    title: r.title,
    subtitle: r.subtitle || '',
    description: r.description || '',
    ingredients: (r.ingredients || []).map((i) => ({ name: i.name, amount: i.amount || '' })),
    steps: (r.steps || [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => s.text),
    image: r.image_url || '',
    prep_time: r.prep_time ?? null,
    cook_time: r.cook_time ?? null,
    servings: r.servings ?? null,
    difficulty: r.difficulty || '',
    tags: r.tags || [],
    featured: !!r.is_featured,
    category: cat ? { name: cat.name, slug: cat.slug } : null,
    region: reg ? { name: reg.name, slug: reg.slug } : null,
    created_at: r.created_at || null,
    updated_at: r.updated_at || null,
    // Accent-folded search haystack: title + subtitle + description + ingredients + tags.
    search: slugify(
      [r.title, r.subtitle, r.description, ...(r.ingredients || []).map((i) => i.name), ...(r.tags || [])].join(' ')
    ).replace(/-/g, ' '),
  };
});

outRecipes.sort((a, b) => a.title.localeCompare(b.title, 'es'));

const content = {
  recipes: outRecipes,
  categories: categories
    .slice()
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((c) => ({ name: c.name, slug: c.slug })),
  regions: regions
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((r) => ({ name: r.name, slug: r.slug })),
};

mkdirSync(join(root, 'src', 'generated'), { recursive: true });
writeFileSync(join(root, 'src', 'generated', 'content.json'), JSON.stringify(content));
console.log(
  `content.json: ${content.recipes.length} recipes, ${content.categories.length} categories, ${content.regions.length} regions`
);
