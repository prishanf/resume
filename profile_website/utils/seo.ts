import { canonicalUrl, siteOrigin } from '~/utils/canonical'

export const SITE_NAME = 'Prishan Fernando'
export const PERSON_NAME = 'Prishan Fernando'
export const PERSON_JOB_TITLE = 'AI Solutions Architect & Builder'
export const PERSON_LOCATION = 'Vancouver, BC'
/** Site-wide default meta / OG / Twitter description. Keep at or under 160 characters. */
export const DEFAULT_SITE_DESCRIPTION = 'AI Solutions Architect & Builder. I solve real business problems with AI — not the other way around. Insights, tools and experiments from Vancouver, BC.'
export const DEFAULT_OG_IMAGE_PATH = '/images/og-default.jpg'
export const PROFILE_IMAGE_PATH = '/images/posts/me.jpg'
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/prishanf'
export const GITHUB_PROFILE_URL = 'https://github.com/prishanf'
export const SAME_AS = [LINKEDIN_PROFILE_URL, GITHUB_PROFILE_URL]

export const PERSON_KNOWS_ABOUT = [
  'Artificial Intelligence',
  'AI Solutions Architecture',
  'AI-assisted Software Development',
  'AI Automation',
  'AI Governance',
  'Data Security',
  'Salesforce',
  'Agentforce',
  'Enterprise Architecture'
]

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
  const raw = value instanceof Date
    ? undefined
    : String(value).trim()
  const isoDay = raw?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDay) return `${isoDay[1]}-${isoDay[2]}-${isoDay[3]}`
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear()
    const m = String(value.getUTCMonth() + 1).padStart(2, '0')
    const d = String(value.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  if (!raw) return undefined
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return undefined
  const y = parsed.getUTCFullYear()
  const m = String(parsed.getUTCMonth() + 1).padStart(2, '0')
  const d = String(parsed.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type FaqItem = { question: string; answer: string }

export function faqPageJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function personJsonLd(siteUrl?: string | null, extras?: {
  jobTitle?: string
  knowsAbout?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    jobTitle: extras?.jobTitle || PERSON_JOB_TITLE,
    url: canonicalUrl(siteUrl, '/'),
    sameAs: SAME_AS,
    worksFor: {
      '@type': 'Organization',
      name: 'Slalom'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA'
    },
    knowsAbout: extras?.knowsAbout || PERSON_KNOWS_ABOUT
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

export function webPageJsonLd(opts: {
  siteUrl?: string | null
  path: string
  name: string
  description?: string
}) {
  const url = canonicalUrl(opts.siteUrl, opts.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description || undefined,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: canonicalUrl(opts.siteUrl, '/')
    },
    about: personJsonLd(opts.siteUrl)
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
