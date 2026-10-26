import { serverQueryContent } from '#content/server'
import { canonicalUrl, siteOrigin } from '~/utils/canonical'

type SitemapEntry = {
  loc: string
  lastmod?: string
}

const STATIC_PATHS = [
  '/',
  '/about',
  '/experience',
  '/education',
  '/certifications',
  '/endorsements',
  '/expertise',
  '/speaking',
  '/tools',
  '/tools/mortgage-calculator',
  '/tools/canadian-tax-calculator',
  '/tools/heloc-mortgage-calculator',
  '/tools/rrsp-vs-tfsa-calculator',
  '/tools/rental-application',
  '/tools/todo-board',
  '/posts',
  '/podcasts',
  '/book-summaries',
  '/youtube-videos',
  '/activity-summary'
]

function toLastmod(value: unknown): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().slice(0, 10)
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function urlEntry(siteUrl: string, path: string, lastmod?: string): SitemapEntry {
  return {
    loc: canonicalUrl(siteUrl, path),
    lastmod
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const origin = siteOrigin(config.public.siteUrl as string | undefined)

  const [posts, podcasts, evidence] = await Promise.all([
    serverQueryContent(event, 'posts')
      .where({ published: { $ne: false } })
      .only(['_path', 'date'])
      .find(),
    serverQueryContent(event, 'podcasts')
      .where({ published: { $ne: false } })
      .only(['_path', 'date'])
      .find(),
    serverQueryContent(event, 'evidence')
      .only(['_path', 'date'])
      .find()
  ])

  const entries: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => urlEntry(origin, path)),
    ...posts
      .filter((doc) => doc._path)
      .map((doc) => urlEntry(origin, doc._path as string, toLastmod(doc.date))),
    ...podcasts
      .filter((doc) => doc._path)
      .map((doc) => urlEntry(origin, doc._path as string, toLastmod(doc.date))),
    ...evidence
      .filter((doc) => doc._path)
      .map((doc) => urlEntry(origin, doc._path as string, toLastmod(doc.date)))
  ]

  const seen = new Set<string>()
  const unique = entries.filter((entry) => {
    if (seen.has(entry.loc)) return false
    seen.add(entry.loc)
    return true
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`
  })
  .join('\n')}
</urlset>
`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
