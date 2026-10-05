// originespana-seo — zone worker for originespana.com (2026-10-04, GscOps batch C).
//
// CONTEXT: production (originespana.pages.dev, another account) was rebuilt
// 2026-09-21 from a stale 10-recipe source; the 84-page Spanish-default site
// that GSC ranks (/receta/<slug>, e.g. albondigas-en-salsa 217i/28d) now
// 404s. The lost content is not web-recoverable (Wayback empty). This worker
// stops the bleed and upgrades the live pages:
//   1. /receta/<slug> where <slug> is one of the 10 live recipes -> 301 to
//      /es/receta/<slug>/ (same content, new bilingual layout). All other
//      /receta/* -> 301 /es/recetas/ (index soft-landing).
//   2. SEO injection on the live money pages (paella valenciana ES + EN,
//      tortilla de patatas, gazpacho andaluz): exact-query title, answer-led
//      meta description, FAQPage JSON-LD + visible answer block after the H1.
// Everything else: pure passthrough to origin. DNS is proxied (CNAME to
// originespana.pages.dev), so this route fires on every request.

const LIVE_SLUGS = new Set([
  'alcachofas-guisadas-de-la-abuela', 'paella-valenciana', 'tortilla-de-patatas',
  'gazpacho-andaluz', 'fabada-asturiana', 'salmorejo-cordobes', 'pisto-manchego',
  'caldo-gallego', 'escalivada-catalana', 'crema-catalana',
]);

const SEO_OVERRIDES = {
  '/recipes/paella-valenciana/': {
    title: 'Paella Valenciana — Receta Tradicional (Arroz, Pollo y Conejo)',
    desc: 'La paella valenciana original: arroz bomba, pollo y conejo, judía verde y garrofón, azafrán y aceite. Receta tradicional paso a paso.',
    answer: 'La paella valenciana es el arroz original de Valencia: arroz bomba con pollo y conejo sofrito, judía verde plana y garrofón, azafrán y aceite de oliva, cocinado en paella hasta que el fondo se tuesta en el socarrat. Sin chorizo — la receta tradicional lo excluye.',
    faqs: [
      { q: '¿Qué lleva la paella valenciana de verdad?', a: 'Arroz, pollo, conejo, judía verde plana, garrofón, tomate, azafrán, aceite de oliva, pimentón y caldo del propio sofrito. El chorizo no forma parte de la receta tradicional.' },
      { q: '¿Qué arroz se usa para paella?', a: 'Variedades redondas que absorben caldo sin romperse — arroz bomba o senia son las tradicionales de Valencia.' },
      { q: '¿Qué es el socarrat?', a: 'La capa tostada de arroz que se forma en el fondo de la paella cuando el caldo se acaba justo al final de la cocción: la firma de una paella bien hecha.' },
    ],
  },
  '/recipes/paella-valenciana/': {
    title: 'Paella Valenciana Recipe — Traditional Spanish Rice with Chicken and Rabbit',
    desc: 'Traditional paella valenciana: bomba rice with chicken and rabbit, flat green beans and garrofón, saffron and olive oil to a toasted socarrat. Step by step.',
    answer: 'Paella valenciana is the original rice dish of Valencia: bomba rice with seared chicken and rabbit, flat green beans and butter beans (garrofón), saffron and olive oil, cooked wide and fast in the pan until the bottom toasts into the socarrat. No chorizo — the traditional recipe excludes it.',
    faqs: [
      { q: 'What goes in authentic paella valenciana?', a: 'Rice, chicken, rabbit, flat green beans, garrofón lima beans, tomato, saffron, olive oil, paprika and a broth from the same sofrito. Chorizo is not part of the traditional recipe.' },
      { q: 'What rice is used for paella?', a: 'Short-grain rounds that absorb broth without breaking — bomba or senia, the traditional Valencia varieties.' },
      { q: 'What is socarrat?', a: 'The toasted layer of rice that forms on the pan bottom as the broth finishes — the signature of a properly made paella.' },
    ],
  },
  '/recipes/tortilla-de-patatas/': {
    title: 'Tortilla de Patatas — Receta Tradicional Española',
    desc: 'La tortilla de patatas tradicional: patatas confitadas en aceite, cebolla, huevos y la vuelta perfecta. Jugosa por dentro, dorada por fuera.',
    answer: 'La tortilla de patatas es el plato más universal de la cocina española: patatas confitadas lentamente en aceite de oliva, mezcladas con huevo (y cebolla en la receta tradicional) y cuajadas en la sartén hasta quedar dorada por fuera y jugosa por dentro.',
    faqs: [
      { q: '¿Lleva cebolla la tortilla de patatas?', a: 'La receta tradicional con cebolla es la mayoritaria en España — la dulzura de la cebolla confitada con la patata es la combinación clásica.' },
      { q: '¿Cómo se consigue una tortilla jugosa?', a: 'Confitando las patatas a fuego suave en abundante aceite y cuajando la tortilla poco: el centro debe quedar apenas cuajado.' },
    ],
  },
  '/recipes/gazpacho-andaluz/': {
    title: 'Gazpacho Andaluz — Receta Tradicional Fría',
    desc: 'El gazpacho andaluz tradicional: tomate maduro, pan, pepino, pimiento, ajo y aceite de oliva, batidos en frío. La sopa fría de Andalucía.',
    answer: 'El gazpacho andaluz es la sopa fría de Andalucía: tomate maduro, pan remojado, pepino, pimiento verde, ajo, aceite de oliva, vinagre y sal, batidos hasta una crema ligera y servido bien frío.',
    faqs: [
      { q: '¿Qué es el gazpacho?', a: 'Una sopa fría de tomate de origen andaluz: verduras crudas, pan y aceite de oliva batidos. No lleva cocción.' },
      { q: '¿Qué diferencia hay entre gazpacho y salmorejo?', a: 'El salmorejo es cordobés, más denso (solo tomate, pan, aceite y ajo) y se sirve con huevo y jamón; el gazpacho lleva más verduras y es más ligero.' },
    ],
  },
};

function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function escText(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function seoInjection(o) {
  const faq = '<section id="gscops-faq" style="margin:2rem 0 0;max-width:46rem">'
    + '<h2 style="font-size:1.35rem;font-weight:600;margin:0 0 1rem">Preguntas / Questions</h2>'
    + o.faqs.map((f) => '<div style="margin:0 0 1.1rem"><h3 style="font-size:1.05rem;font-weight:600;margin:0 0 .3rem">' + escText(f.q) + '</h3><p style="margin:0;line-height:1.6">' + escText(f.a) + '</p></div>').join('')
    + '</section>';
  return '<div id="gscops-answer" style="margin:1.1rem 0 0;max-width:46rem"><p style="line-height:1.65">' + escText(o.answer) + '</p></div>' + faq;
}
function faqJsonLd(o) {
  return '<script type="application/ld+json" id="gscops-faqpage">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: o.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }).replace(/<\//g, '<\\/') + '</script>';
}
function applySeo(html, o) {
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escAttr(o.title) + '<\/title>');
  html = html.replace(/(<meta\s+name=["']description["'][^>]*?content=["'])[^"']*(["'])/i, '$1' + escAttr(o.desc) + '$2');
  html = html.replace(/(<meta\s+property=["']og:description["'][^>]*?content=["'])[^"']*(["'])/i, '$1' + escAttr(o.desc) + '$2');
  html = html.replace(/(<meta\s+name=["']twitter:description["'][^>]*?content=["'])[^"']*(["'])/i, '$1' + escAttr(o.desc) + '$2');
  const h1 = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/);
  if (h1) html = html.replace(h1[0], h1[0] + seoInjection(o));
  html = html.replace(/<\/head>/i, faqJsonLd(o) + '</head>');
  return html;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;
    // 1) Dead /receta/* URLs from the pre-rebuild site: 301 to live equivalents.
    const m = p.match(/^\/receta\/([^/]+)\/?$/);
    if (m) {
      const slug = m[1];
      const dest = LIVE_SLUGS.has(slug) ? '/recipes/' + slug + '/' : '/recipes/';
      return Response.redirect(new URL(dest, url.origin).toString(), 301);
    }
    // 2) SEO injection on live money pages; passthrough for everything else.
    const o = SEO_OVERRIDES[p];
    const res = await fetch(request);
    if (!o) return res;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return res;
    const html = await res.text();
    return new Response(applySeo(html, o), { status: res.status, statusText: res.statusText, headers: res.headers });
  },
};
