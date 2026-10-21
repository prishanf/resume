# Adding a tool

The `/tools/` hub is an index of cards driven by `data/toolsCatalog.ts`. A new tool each week is one page plus one catalog row.

1. **Page** — add `pages/tools/<slug>.vue`. Keep the existing hero pattern (back link to `/tools/`, `usePageSeo`, trailing-slash routes).
2. **Catalog** — append an object to `TOOLS` in `data/toolsCatalog.ts` (`slug`, `path`, `title`, `description`, `cta`, `icon`). The hub page maps that list; no card markup to copy.
3. **Calculator SEO** (if it is a calculator) — add an entry in `data/toolSeo.ts` with a unique title (~60 characters), meta description (≤160), 300–500 words of explainer copy, 4–6 FAQs, and related post paths. Render `<ToolsToolSeoContent seo-key="<slug>" />` below the tool. Only state rates or rules the tool code already uses.
4. **Sitemap** — add `/tools/<slug>` to `STATIC_PATHS` in `server/routes/sitemap.xml.ts`.
5. **Posts** — link the matching existing articles to the tool, and link back from the tool’s “Related reading” list.

Do not invent figures. Do not mention unused brand names. Keep canonicals and trailing slashes as the rest of the site does.
