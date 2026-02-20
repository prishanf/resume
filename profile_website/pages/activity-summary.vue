<template>
  <div class="min-h-screen bg-inverse">
    <ActivitySummaryHero v-if="summary" :summary="summary" />

    <template v-if="!pending && data">
      <ActivitySummaryHeatmap
        :heatmap="heatmap"
        :heatmap-month-label="heatmapMonthLabel"
        :type-breakdown="typeBreakdown"
        :this-week="thisWeek"
      />

      <ActivitySummaryMonthNav
        v-if="months.length > 0"
        :months="months"
        :active-month-id="activeMonthId"
        @select-month="activeMonthId = $event"
      />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p
          v-if="months.length === 0"
          class="text-center text-gray-500 font-medium py-12"
        >
          No activity data yet. Set <code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITHUB_REPO</code> (e.g. <code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">owner/repo</code>) in your env and run <code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">npm run sync-activity-summary</code> before build.
        </p>
        <ActivitySummaryMonth
          v-for="month in months"
          :key="month.id"
          :month="month"
          :class="{ hidden: activeMonthId && activeMonthId !== month.id }"
        />
      </main>

      <footer class="bg-primary mt-4 py-8 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/50 text-xs font-medium">
            Build log updated at build time via sync script · Last sync: {{ lastSyncFormatted }}
          </p>
          <div class="flex items-center gap-4">
            <a
              :href="config.public.githubProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/50 hover:text-accent text-xs font-medium transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </template>

    <div v-else-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p class="text-gray-500 font-medium">Loading activity…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const {
  summary,
  heatmap,
  typeBreakdown,
  thisWeek,
  months,
  lastSync,
  heatmapMonthLabel,
  pending,
  data,
} = useActivitySummary()

const activeMonthId = ref('')

watch(months, (m) => {
  if (m.length) {
    if (!activeMonthId.value) activeMonthId.value = m[0].id
  }
}, { immediate: true })

const lastSyncFormatted = computed(() => {
  if (!lastSync.value) return '—'
  const d = new Date(lastSync.value)
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
})
</script>

<style scoped>
/* Ensure month sections can be toggled */
.activity-month-section.hidden {
  display: none !important;
}
</style>
