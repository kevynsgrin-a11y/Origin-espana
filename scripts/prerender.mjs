// Prerenders every route into static HTML in dist/, and generates
// sitemap.xml, _redirects (legacy UUID -> slug 301s) and 404.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { render, getPageMeta, renderHead, recipes, categories, regions, SITE } = await import(
  join(root, 'dist-ssr', 'entry-server.js')
);

const template = readFileSync(join(root, 'dist', 'index.html'), 'utf8');

const routes = [
  '/',
  '/search',
  ...recipes.map((r) => `/receta/${r.slug}`),
  ...categories.map((c) => `/recetas/${c.slug}`),
  ...regions.map((r) => `/regiones/${r.slug}`),
  '/sobre-nosotros',
  '/contacto',
  '/privacidad',
  '/cookies',
  '/aviso-legal',
  '/estandares',
];

function pageHtml(route) {
  const meta = getPageMeta(route);
  const html = render(route);
  return template.replace('<!--head-tags-->', renderHead(meta)).replace('<!--app-html-->', html);
}

for (const route of routes) {
  const out = pageHtml(route);
  const dir = route === '/' ? join(root, 'dist') : join(root, 'dist', route.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), out);
}

// Real 404 page — Cloudflare Pages serves dist/404.html with a 404 status.
writeFileSync(join(root, 'dist', '404.html'), pageHtml('/pagina-no-encontrada'));

// sitemap.xml — indexable routes only (no /search).
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r !== '/search')
  .map((r) => {
    const recipe = recipes.find((x) => `/receta/${x.slug}` === r);
    const lastmod = recipe?.updated_at ? recipe.updated_at.slice(0, 10) : today;
    return `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${lastmod}</lastmod></url>`;
  })
  .join('\n');
writeFileSync(
  join(root, 'dist', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

// _redirects — permanent redirects from legacy UUID URLs to slug URLs.
const redirects = recipes.map((r) => `/recipe/${r.id} /receta/${r.slug} 301`).join('\n');
writeFileSync(join(root, 'dist', '_redirects'), redirects + '\n');

console.log(`prerendered ${routes.length} routes + 404.html, sitemap (${routes.length - 1} urls), ${recipes.length} redirects`);
