const DEFAULT_SITE_URL = 'https://prishanfernando.com'

/** Origin without a trailing slash, e.g. https://prishanfernando.com */
export function siteOrigin(siteUrl?: string | null) {
  const raw = String(siteUrl || DEFAULT_SITE_URL).trim()
  return raw.replace(/\/+$/, '') || DEFAULT_SITE_URL
}

/** Path in the trailing-slash form the live site redirects to. */
export function canonicalPath(path: string) {
  if (!path || path === '/') return '/'
  return `${path.replace(/\/+$/, '')}/`
}

/** Absolute self-referencing URL, always with a trailing slash. */
export function canonicalUrl(siteUrl: string | null | undefined, path: string) {
  return `${siteOrigin(siteUrl)}${canonicalPath(path)}`
}
