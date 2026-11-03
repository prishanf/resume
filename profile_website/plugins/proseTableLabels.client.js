import { applyProseTableDataLabels } from '~/utils/proseTableLabels'

export default defineNuxtPlugin((nuxtApp) => {
  const relabel = () => {
    if (typeof document === 'undefined') return
    applyProseTableDataLabels(document)
  }

  nuxtApp.hook('page:finish', () => {
    nextTick(relabel)
  })

  nuxtApp.hook('app:mounted', () => {
    nextTick(relabel)
  })
})
