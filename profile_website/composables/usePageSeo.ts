import {
  SITE_NAME,
  absoluteAssetUrl,
  defaultOgImage,
  toIsoDate
} from '~/utils/seo'
import { canonicalUrl } from '~/utils/canonical'

type OgType = 'website' | 'article'

type PageSeoInput = {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  type?: MaybeRefOrGetter<OgType>
  image?: MaybeRefOrGetter<string | undefined | null>
  jsonLd?: MaybeRefOrGetter<object | object[] | undefined | null>
  articleAuthor?: MaybeRefOrGetter<string | undefined>
  articlePublishedTime?: MaybeRefOrGetter<string | unknown>
  articleModifiedTime?: MaybeRefOrGetter<string | unknown>
}

export function usePageSeo(input: PageSeoInput) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string | undefined

  const pageUrl = computed(() => canonicalUrl(siteUrl, route.path))
  const title = computed(() => toValue(input.title))
  const description = computed(() => toValue(input.description))
  const ogType = computed(() => toValue(input.type) || 'website')
  const ogImage = computed(() => {
    const image = input.image ? toValue(input.image) : undefined
    return image ? absoluteAssetUrl(siteUrl, image) : defaultOgImage(siteUrl)
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogUrl: () => pageUrl.value,
    ogType: () => ogType.value,
    ogImage: () => ogImage.value,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => ogImage.value,
    articleAuthor: () => toValue(input.articleAuthor) || undefined,
    articlePublishedTime: () => toIsoDate(toValue(input.articlePublishedTime)),
    articleModifiedTime: () => toIsoDate(toValue(input.articleModifiedTime))
  })

  useHead(() => {
    const jsonLd = input.jsonLd ? toValue(input.jsonLd) : undefined
    if (!jsonLd) return {}
    const nodes = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    return {
      script: nodes.map((node, index) => ({
        key: `ldjson-${index}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(node)
      }))
    }
  })

  return { pageUrl, ogImage }
}
