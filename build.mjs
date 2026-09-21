#!/usr/bin/env node
// Origin España — deterministic static site builder.
// No framework, no runtime database: recipes.json in, HTML/sitemap/robots out.
// The July SPA build shipped without its Supabase env vars and has been serving
// an error shell to users and crawlers; this rebuild serves complete,
// crawlable HTML on every request. Deployed direct-upload to the existing
// Cloudflare Pages project "originespana" (originespana.com).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://originespana.com';
const SITE_NAME = 'Origin España';
const TAGLINE = 'Cocina tradicional española, de la receta de la abuela a tu mesa';
const TODAY = new Date().toISOString().slice(0, 10);
const recipes = JSON.parse(readFileSync(new URL('./recipes.json', import.meta.url), 'utf8'));

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const iso8601 = (m) => `PT${String(m).padStart(2, '0')}M`;
const totalMinutes = (r) => r.prepMinutes + r.cookMinutes;

const CSS = `:root{--ink:#2b2118;--cream:#faf6ef;--paper:#fff;--terra:#a34a2a;--olive:#5c6b3f;--line:#e7ddcd;--soft:#6f6353}*
{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font:17px/1.65 Georgia,'Iowan Old Style','Times New Roman',serif;color:var(--ink);background:var(--cream)}
a{color:var(--terra);text-decoration:none}a:hover{text-decoration:underline}.wrap{max-width:880px;margin:0 auto;padding:0 20px}
header.site{border-bottom:2px solid var(--ink);background:var(--paper)}.site .wrap{display:flex;align-items:baseline;justify-content:space-between;padding:18px 20px}
.brand{font-size:1.45rem;font-weight:700;color:var(--ink);letter-spacing:.2px}.brand em{color:var(--terra);font-style:normal}
nav.main a{margin-left:20px;font-size:.95rem;color:var(--soft)}nav.main a:hover{color:var(--terra);text-decoration:none}
.hero{padding:56px 0 40px}.hero h1{font-size:2.3rem;line-height:1.2;max-width:640px}.hero p{margin-top:14px;max-width:560px;color:var(--soft);font-size:1.05rem}
.kicker{display:inline-block;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--olive);border:1px solid var(--olive);border-radius:999px;padding:3px 12px;margin-bottom:18px}
section{padding:34px 0}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:20px 20px 16px;transition:box-shadow .15s}
.card:hover{box-shadow:0 4px 18px rgba(43,33,24,.08);text-decoration:none}.card h3{font-size:1.12rem;line-height:1.3}
.card .meta{margin-top:8px;font-size:.82rem;color:var(--soft)}.card .region{color:var(--olive)}
h2.section-title{font-size:1.5rem;margin-bottom:20px}.recipe h1{font-size:2.05rem;line-height:1.25;max-width:680px}
.recipe .lede{margin:16px 0 6px;font-size:1.08rem;color:var(--soft);max-width:640px}
.recipe .facts{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 26px}.fact{font-size:.85rem;background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:6px 12px}
.cols{display:grid;grid-template-columns:290px 1fr;gap:36px}.cols h2{font-size:1.15rem;margin-bottom:12px}
ul.ingredients{list-style:none}.ingredients li{padding:7px 0;border-bottom:1px dashed var(--line);font-size:.98rem}
ol.steps{counter-reset:step;list-style:none}.steps li{counter-increment:step;position:relative;padding:0 0 18px 44px}
.steps li::before{content:counter(step);position:absolute;left:0;top:1px;width:28px;height:28px;border-radius:50%;background:var(--terra);color:#fff;font-size:.9rem;display:flex;align-items:center;justify-content:center;font-family:system-ui}
.steps li::after{content:'';position:absolute;left:13px;top:32px;bottom:2px;width:1px;background:var(--line)}
.steps li:last-child::after{display:none}.note{margin-top:26px;padding:14px 18px;background:#f3efe4;border-left:3px solid var(--olive);font-size:.95rem;border-radius:0 8px 8px 0}
footer.site{margin-top:60px;border-top:2px solid var(--ink);background:var(--paper);padding:26px 0;font-size:.88rem;color:var(--soft)}
footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
@media(max-width:720px){.cols{grid-template-columns:1fr}.hero h1{font-size:1.8rem}.site .wrap{flex-direction:column;gap:8px}}`;

function head({ title, desc, path, jsonLd = [] }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${path}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta name="twitter:card" content="summary">
<style>${CSS}</style>
${jsonLd.map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`).join('\n')}
</head>
<body>`;
}

const header = `<header class="site"><div class="wrap"><a class="brand" href="/">Origin <em>España</em></a><nav class="main"><a href="/recetas/">Recetas</a><a href="/#regiones">Regiones</a></nav></div></header>`;
const footer = `<footer class="site"><div class="wrap"><span>© ${TODAY.slice(0, 4)} Origin España — cocina tradicional</span><span>Recetas de la abuela, cocinadas sin prisa</span></div></footer>`;

function recipeJsonLd(r) {
  return {
    '@context': 'https://schema.org', '@type': 'Recipe',
    name: r.title, description: r.description, inLanguage: 'es',
    recipeCuisine: 'Española', recipeCategory: r.category,
    keywords: r.tags.join(', '), author: { '@type': 'Organization', name: SITE_NAME, url: ORIGIN },
    prepTime: iso8601(r.prepMinutes), cookTime: iso8601(r.cookMinutes), totalTime: iso8601(totalMinutes(r)),
    recipeYield: `${r.servings} raciones`,
    recipeIngredient: r.ingredients.map((i) => `${i.qty} ${i.item}`.trim()),
    recipeInstructions: r.steps.map((s, n) => ({ '@type': 'HowToStep', position: n + 1, name: s.name, text: s.text })),
  };
}

function recipePage(r) {
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ORIGIN}/` },
    { '@type': 'ListItem', position: 2, name: 'Recetas', item: `${ORIGIN}/recetas/` },
    { '@type': 'ListItem', position: 3, name: r.title, item: `${ORIGIN}/receta/${r.slug}/` }] };
  return `${head({ title: `${r.title} — Receta Tradicional | ${SITE_NAME}`, desc: r.description, path: `/receta/${r.slug}/`, jsonLd: [recipeJsonLd(r), breadcrumb] })}
${header}
<main class="wrap recipe">
  <p class="kicker">${esc(r.region)} · ${esc(r.category)}</p>
  <h1>${esc(r.title)}</h1>
  <p class="lede">${esc(r.subtitle)}</p>
  <div class="facts">
    <span class="fact">Preparación: ${r.prepMinutes} min</span><span class="fact">Cocción: ${r.cookMinutes} min</span>
    <span class="fact">Total: ${Math.floor(totalMinutes(r) / 60)} h ${totalMinutes(r) % 60} min</span><span class="fact">${r.servings} raciones</span>
  </div>
  <div class="cols">
    <div><h2>Ingredientes</h2><ul class="ingredients">${r.ingredients.map((i) => `<li>${esc(`${i.qty ? i.qty + ' ' : ''}${i.item}`.trim())}</li>`).join('')}</ul></div>
    <div><h2>Elaboración</h2><ol class="steps">${r.steps.map((s) => `<li><strong>${esc(s.name)}.</strong> ${esc(s.text)}</li>`).join('')}</ol>
    ${r.note ? `<div class="note"><strong>Nota de la abuela.</strong> ${esc(r.note)}</div>` : ''}</div>
  </div>
</main>
${footer}
</body></html>`;
}

const card = (r) => `<a class="card" href="/receta/${r.slug}/"><h3>${esc(r.title)}</h3><p class="meta"><span class="region">${esc(r.region)}</span> · ${esc(r.category)} · ${Math.round(totalMinutes(r) / 60 * 10) / 10} h</p></a>`;

const home = `${head({ title: `${SITE_NAME} — Cocina Tradicional Española y Catalana`, desc: TAGLINE + '. Recetas auténticas de toda España: arroces, guisos, tortillas y postres, explicados paso a paso.', path: '/', jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: ORIGIN, inLanguage: 'es' }] })}
${header}
<main class="wrap">
  <section class="hero"><span class="kicker">Recetas de toda la vida</span><h1>${esc(TAGLINE)}</h1>
  <p>Cada receta está escrita para cocinarse de verdad: ingredientes de mercado, tiempos reales y los trucos que hacen la diferencia entre comer y disfrutar.</p></section>
  <section id="regiones"><h2 class="section-title">Recetas fundamentales</h2><div class="cards">${recipes.map(card).join('')}</div></section>
  <section><h2 class="section-title">Por región</h2><p>${[...new Set(recipes.map((r) => r.region))].map((rg) => `<a href="/recetas/">${esc(rg)}</a>`).join(' · ')}</p></section>
</main>
${footer}
</body></html>`;

const list = `${head({ title: `Todas las recetas | ${SITE_NAME}`, desc: 'Índice completo de recetas tradicionales españolas: por región, categoría y tiempo de cocción.', path: '/recetas/' })}
${header}
<main class="wrap"><section><h1 style="font-size:1.9rem;margin:30px 0 6px">Todas las recetas</h1>
<p class="lede" style="margin-bottom:24px">${recipes.length} recetas tradicionales, de ${[...new Set(recipes.map((r) => r.region))].length} regiones.</p>
<div class="cards" style="padding-bottom:50px">${recipes.map(card).join('')}</div></section></main>
${footer}
</body></html>`;

const search = `${head({ title: `Buscar | ${SITE_NAME}`, desc: 'Buscador de recetas tradicionales españolas.', path: '/buscar/', jsonLd: [] })}
${header}<main class="wrap"><section style="padding:50px 0"><h1>Buscar recetas</h1>
<p class="lede" style="margin:14px 0 20px">El buscador interactivo está de camino. Mientras tanto, el <a href="/recetas/">índice completo de recetas</a> sirve igual.</p>
<p><a class="fact" href="/recetas/" style="display:inline-block">Ir al índice →</a></p></section></main>${footer}</body></html>`;

const notFound = `${head({ title: `Página no encontrada | ${SITE_NAME}`, desc: 'Página no encontrada.', path: '/404.html' })}
${header}<main class="wrap"><section style="padding:60px 0"><h1>404 — Esta página se nos ha quemado</h1>
<p class="lede" style="margin:14px 0 20px">Como un ajo pasado de fuego. Vuelve al <a href="/">inicio</a> o al <a href="/recetas/">índice de recetas</a>.</p></section></main>${footer}</body></html>`;

const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const write = (rel, content) => { mkdirSync(join(dist, rel), { recursive: true }); writeFileSync(join(dist, rel, 'index.html'), content); };
write('.', home); write('recetas', list); write('buscar', search);
for (const r of recipes) write(`receta/${r.slug}`, recipePage(r));
writeFileSync(join(dist, '404.html'), notFound);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
const urls = ['', 'recetas/', 'buscar/', ...recipes.map((r) => `receta/${r.slug}/`)];
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${ORIGIN}/${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Origin España: built ${urls.length} URLs (${recipes.length} recipes) -> dist/`);
