import { applyProseTableDataLabels } from '~/utils/proseTableLabels'

/**
 * Keep `data-label` attributes in sync after ContentRenderer paints or the
 * route swaps post bodies. Attribute mutations are ignored so relabelling
 * does not loop.
 *
 * @param {import('vue').Ref<Element | null>} rootRef
 * @param {import('vue').MaybeRefOrGetter<unknown>} [source] extra signal (post body / path)
 */
export function useProseTableLabels (rootRef, source) {
  let observer

  const relabel = () => {
    const root = unref(rootRef)
    if (root) applyProseTableDataLabels(root)
  }

  const observe = (el) => {
    observer?.disconnect()
    observer = undefined
    if (!el || typeof MutationObserver === 'undefined') return
    observer = new MutationObserver(relabel)
    observer.observe(el, { childList: true, subtree: true })
  }

  onMounted(() => {
    relabel()
    observe(unref(rootRef))
  })

  watch(() => unref(rootRef), (el) => {
    relabel()
    observe(el)
  })

  if (source !== undefined) {
    watch(() => toValue(source), async () => {
      await nextTick()
      relabel()
    })
  }

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = undefined
  })
}
