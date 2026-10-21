import { canonicalUrl } from '~/utils/canonical'

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()

  useHead(() => ({
    link: [
      {
        key: 'canonical',
        rel: 'canonical',
        href: canonicalUrl(config.public.siteUrl as string | undefined, route.path)
      }
    ]
  }))
})
