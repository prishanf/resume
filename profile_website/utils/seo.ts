import { canonicalUrl, siteOrigin } from '~/utils/canonical'

export const SITE_NAME = 'Prishan Fernando'
export const PERSON_NAME = 'Prishan Fernando'
export const PERSON_JOB_TITLE = 'Salesforce / Solutions Architect'
export const DEFAULT_OG_IMAGE_PATH = '/images/posts/profile-website-hero.png'
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/prishanf'
export const GITHUB_PROFILE_URL = 'https://github.com/prishanf'
export const SAME_AS = [LINKEDIN_PROFILE_URL, GITHUB_PROFILE_URL]

export function defaultOgImage(siteUrl?: string | null) {
  return `${siteOrigin(siteUrl)}${DEFAULT_OG_IMAGE_PATH}`
}

export function absoluteAssetUrl(siteUrl: string | null | undefined, src?: string | null) {
  if (!src) return defaultOgImage(siteUrl)
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  const origin = siteOrigin(siteUrl)
  return src.startsWith('/') ? `${origin}${src}` : `${origin}/${src}`
}

export function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  const raw = String(value).trim()
  if (!raw) return undefined
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString().slice(0, 10)
}

export function personJsonLd(siteUrl?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    jobTitle: PERSON_JOB_TITLE,
    url: canonicalUrl(siteUrl, '/'),
    sameAs: SAME_AS
  }
}

export function websiteJsonLd(siteUrl?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: canonicalUrl(siteUrl, '/'),
    publisher: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: canonicalUrl(siteUrl, '/')
    }
  }
}

export function blogPostingJsonLd(opts: {
  siteUrl?: string | null
  headline: string
  description?: string
  datePublished?: unknown
  dateModified?: unknown
  path: string
  image?: string | null
}) {
  const url = canonicalUrl(opts.siteUrl, opts.path)
  const published = toIsoDate(opts.datePublished)
  const modified = toIsoDate(opts.dateModified) || published
  const image = opts.image ? absoluteAssetUrl(opts.siteUrl, opts.image) : defaultOgImage(opts.siteUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description || undefined,
    datePublished: published,
    dateModified: modified,
    author: {
      '@type': 'Person',
      name: PERSON_NAME,
      jobTitle: PERSON_JOB_TITLE,
      url: canonicalUrl(opts.siteUrl, '/')
    },
    url,
    image,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }
}
