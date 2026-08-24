# Origen España — originespana.com

Static-generated (SSG) recipe site for traditional Spanish and Catalan cuisine.

## Stack
- Vite + React 18 + TypeScript + Tailwind CSS
- Build-time prerendering of every route (173 static HTML pages)
- Data snapshot in `/data` (refreshable from Supabase via `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars at build)

## Commands
- `npm run dev` — dev server
- `npm run build` — full SSG build into `dist/` (client build + SSR build + prerender + sitemap + redirects)
- `npm run lint` / `npm run typecheck`

## Deployment
Cloudflare Pages, build command `npm run build`, output directory `dist`.
`_redirects` (legacy `/recipe/:id` → `/receta/:slug` 301s), `robots.txt`, `sitemap.xml` and `404.html` are generated into `dist/` at build time.
