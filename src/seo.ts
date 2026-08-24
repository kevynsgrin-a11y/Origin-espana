import {
  SITE,
  SITE_NAME,
  Recipe,
  Taxon,
  recipeBySlug,
  categoryBySlug,
  regionBySlug,
  totalTime,
  recipes,
} from './data';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string | null;
  path: string;
  image: string | null;
  noindex: boolean;
  jsonLd: object[];
  status: 200 | 404;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function clamp(s: string, max = 158): string {
  return s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

function recipeMeta(r: Recipe): PageMeta {
  const region = r.region?.name || 'España';
  const tt = totalTime(r);
  const description = clamp(
    `Receta tradicional de ${r.title} (${region}): ingredientes, elaboración paso a paso y origen del plato.` +
      (tt ? ` Lista en ${tt} minutos.` : '')
  );
  const path = `/receta/${r.slug}`;
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: r.title,
      description: r.subtitle || r.title,
      image: r.image ? [r.image] : undefined,
      datePublished: r.created_at || undefined,
      prepTime: r.prep_time != null ? `PT${r.prep_time}M` : undefined,
      cookTime: r.cook_time != null ? `PT${r.cook_time}M` : undefined,
      totalTime: tt != null ? `PT${tt}M` : undefined,
      recipeYield: r.servings != null ? `${r.servings} raciones` : undefined,
      recipeCategory: r.category?.name,
      recipeCuisine: `Española — ${region}`,
      keywords: r.tags.join(', ') || undefined,
      recipeIngredient: r.ingredients.map((i) => `${i.amount} ${i.name}`.trim()),
      recipeInstructions: r.steps.map((s) => ({ '@type': 'HowToStep', text: s })),
      inLanguage: 'es',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
        r.category
          ? {
              '@type': 'ListItem',
              position: 2,
              name: r.category.name,
              item: `${SITE}/recetas/${r.category.slug}`,
            }
          : null,
        { '@type': 'ListItem', position: r.category ? 3 : 2, name: r.title, item: `${SITE}${path}` },
      ].filter(Boolean),
    },
  ];
  return {
    title: `${r.title} — Receta tradicional ${region} | ${SITE_NAME}`,
    description,
    canonical: `${SITE}${path}`,
    path,
    image: r.image || null,
    noindex: false,
    jsonLd,
    status: 200,
  };
}

function collectionMeta(kind: 'category' | 'region', t: Taxon, count: number): PageMeta {
  const path = kind === 'category' ? `/recetas/${t.slug}` : `/regiones/${t.slug}`;
  const title =
    kind === 'category'
      ? `Recetas de ${t.name} — Cocina tradicional española | ${SITE_NAME}`
      : `Cocina de ${t.name}: recetas tradicionales | ${SITE_NAME}`;
  const description = clamp(
    kind === 'category'
      ? `${count} recetas tradicionales de ${t.name.toLowerCase()}: platos clásicos españoles con ingredientes, tiempos y elaboración paso a paso.`
      : `Recetario tradicional de ${t.name}: ${count} recetas de la cocina regional con ingredientes, tiempos y elaboración paso a paso.`
  );
  const list = recipes.filter((r) =>
    kind === 'category' ? r.category?.slug === t.slug : r.region?.slug === t.slug
  );
  return {
    title,
    description,
    canonical: `${SITE}${path}`,
    path,
    image: list[0]?.image || null,
    noindex: false,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: `${SITE}${path}`,
        inLanguage: 'es',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: list.length,
          itemListElement: list.slice(0, 50).map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: r.title,
            url: `${SITE}/receta/${r.slug}`,
          })),
        },
      },
    ],
    status: 200,
  };
}

const staticPages: Record<string, { title: string; description: string }> = {
  '/sobre-nosotros': {
    title: `Sobre nosotros | ${SITE_NAME}`,
    description:
      'Quiénes somos y por qué documentamos el recetario tradicional español: cocina regional auténtica, sin anuncios invasivos.',
  },
  '/contacto': {
    title: `Contacto | ${SITE_NAME}`,
    description: 'Cómo ponerte en contacto con el equipo de Origen España: sugerencias, correcciones y colaboraciones.',
  },
  '/privacidad': {
    title: `Política de privacidad | ${SITE_NAME}`,
    description: 'Política de privacidad de Origen España: qué datos tratamos, con qué finalidad y cuáles son tus derechos.',
  },
  '/cookies': {
    title: `Política de cookies | ${SITE_NAME}`,
    description: 'Política de cookies de Origen España: qué cookies y almacenamiento local utiliza este sitio web.',
  },
  '/aviso-legal': {
    title: `Aviso legal | ${SITE_NAME}`,
    description: 'Aviso legal de Origen España: información del titular del sitio y condiciones de uso.',
  },
  '/estandares': {
    title: `Nuestros estándares editoriales | ${SITE_NAME}`,
    description:
      'Estándares editoriales de Origen España: cómo documentamos, verificamos y presentamos las recetas tradicionales.',
  },
};

export function getPageMeta(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') {
    return {
      title: `${SITE_NAME} — Recetas tradicionales españolas y catalanas, sin anuncios invasivos`,
      description: clamp(
        `Recetario tradicional español: ${recipes.length} recetas de cocina regional con ingredientes, tiempos y elaboración paso a paso. Sin anuncios invasivos.`
      ),
      canonical: `${SITE}/`,
      path: '/',
      image: recipes.find((r) => r.featured)?.image || null,
      noindex: false,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE}/`,
          inLanguage: 'es',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: `${SITE}/`,
        },
      ],
      status: 200,
    };
  }
  if (clean === '/search') {
    return {
      title: `Buscar recetas | ${SITE_NAME}`,
      description: 'Busca entre todas nuestras recetas tradicionales por nombre o ingrediente.',
      canonical: null,
      path: '/search',
      image: null,
      noindex: true,
      jsonLd: [],
      status: 200,
    };
  }
  const recipeMatch = clean.match(/^\/receta\/([a-z0-9-]+)$/);
  if (recipeMatch) {
    const r = recipeBySlug.get(recipeMatch[1]);
    if (r) return recipeMeta(r);
  }
  const catMatch = clean.match(/^\/recetas\/([a-z0-9-]+)$/);
  if (catMatch) {
    const c = categoryBySlug.get(catMatch[1]);
    if (c)
      return collectionMeta('category', c, recipes.filter((r) => r.category?.slug === c.slug).length);
  }
  const regMatch = clean.match(/^\/regiones\/([a-z0-9-]+)$/);
  if (regMatch) {
    const g = regionBySlug.get(regMatch[1]);
    if (g) return collectionMeta('region', g, recipes.filter((r) => r.region?.slug === g.slug).length);
  }
  if (staticPages[clean]) {
    return {
      ...staticPages[clean],
      canonical: `${SITE}${clean}`,
      path: clean,
      image: null,
      noindex: false,
      jsonLd: [],
      status: 200,
    };
  }
  return {
    title: `Página no encontrada | ${SITE_NAME}`,
    description: 'La página que buscas no existe. Explora nuestras recetas tradicionales españolas.',
    canonical: null,
    path: clean,
    image: null,
    noindex: true,
    jsonLd: [],
    status: 404,
  };
}

/** Serialize a PageMeta into HTML head tags (used by the prerenderer). */
export function renderHead(meta: PageMeta): string {
  const tags: string[] = [];
  tags.push(`<title>${esc(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${esc(meta.description)}" />`);
  if (meta.noindex) tags.push(`<meta name="robots" content="noindex" />`);
  if (meta.canonical) tags.push(`<link rel="canonical" href="${esc(meta.canonical)}" />`);
  tags.push(`<meta property="og:type" content="${meta.path.startsWith('/receta/') ? 'article' : 'website'}" />`);
  tags.push(`<meta property="og:title" content="${esc(meta.title)}" />`);
  tags.push(`<meta property="og:description" content="${esc(meta.description)}" />`);
  if (meta.canonical) tags.push(`<meta property="og:url" content="${esc(meta.canonical)}" />`);
  tags.push(`<meta property="og:site_name" content="${esc(SITE_NAME)}" />`);
  tags.push(`<meta property="og:locale" content="es_ES" />`);
  if (meta.image) {
    tags.push(`<meta property="og:image" content="${esc(meta.image)}" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:image" content="${esc(meta.image)}" />`);
    tags.push(`<meta name="twitter:image:alt" content="${esc(meta.title)}" />`);
  } else {
    tags.push(`<meta name="twitter:card" content="summary" />`);
  }
  tags.push(`<meta name="twitter:title" content="${esc(meta.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${esc(meta.description)}" />`);
  for (const obj of meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
