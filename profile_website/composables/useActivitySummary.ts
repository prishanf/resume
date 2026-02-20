import type { ActivitySummaryData } from '~/types/activity'

const defaultData: ActivitySummaryData = {
  lastSync: new Date().toISOString(),
  summary: { totalCommits: 0, totalFeatures: 0, totalTools: 0, activeDays: 0 },
  heatmap: {},
  typeBreakdown: {},
  thisWeek: { commits: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, weekLabel: '—' },
  months: [],
}

export function useActivitySummary() {
  const { data, pending, error, refresh } = useAsyncData<ActivitySummaryData>(
    'activity-summary',
    () =>
      import('~/data/activity-summary.json')
        .then((m) => (m.default as ActivitySummaryData) ?? defaultData)
        .catch(() => defaultData)
  )

  const activity = computed(() => data.value ?? defaultData)
  const summary = computed(() => activity.value.summary)
  const heatmap = computed(() => activity.value.heatmap)
  const typeBreakdown = computed(() => activity.value.typeBreakdown)
  const thisWeek = computed(() => activity.value.thisWeek)
  const months = computed(() => activity.value.months)
  const lastSync = computed(() => activity.value.lastSync)

  const heatmapMonthLabel = computed(() => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })

  return {
    data: activity,
    summary,
    heatmap,
    typeBreakdown,
    thisWeek,
    months,
    lastSync,
    heatmapMonthLabel,
    pending,
    error,
    refresh,
  }
}
