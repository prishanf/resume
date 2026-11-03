import { applyMarkdownTableDataLabels } from '~/utils/proseTableLabels'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    if (file?.body) applyMarkdownTableDataLabels(file.body)
  })
})
