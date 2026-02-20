<template>
  <section class="bg-white border-b border-gray-100 py-8 overflow-x-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-start gap-8">
        <div class="shrink-0">
          <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">
            Activity — {{ heatmapMonthLabel }}
          </p>
          <div class="flex gap-1.5 flex-wrap max-w-[360px] sm:max-w-[460px]" aria-label="Contribution heatmap">
            <div
              v-for="item in heatmapEntries"
              :key="item.dateKey"
              class="activity-heat-cell w-6 h-6 sm:w-7 sm:h-7 rounded-md transition-transform hover:scale-110"
              :class="heatClass(item.count)"
              :title="heatTooltip(item.dateKey, item.count)"
            />
          </div>
          <div class="flex items-center gap-2 mt-3">
            <span class="text-[10px] text-gray-400 font-medium">Less</span>
            <div class="flex gap-1">
              <div class="w-3 h-3 rounded-sm bg-gray-100" />
              <div class="w-3 h-3 rounded-sm bg-amber-100" />
              <div class="w-3 h-3 rounded-sm bg-amber-300" />
              <div class="w-3 h-3 rounded-sm bg-amber-500" />
              <div class="w-3 h-3 rounded-sm bg-amber-700" />
            </div>
            <span class="text-[10px] text-gray-400 font-medium">More</span>
          </div>
        </div>

        <div v-if="typeBreakdownEntries.length" class="flex-1 min-w-0 hidden sm:block">
          <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">Breakdown by type</p>
          <div class="space-y-2.5">
            <div
              v-for="entry in typeBreakdownEntries"
              :key="entry.label"
              class="flex items-center gap-3"
            >
              <span class="text-[10px] font-medium text-gray-500 w-14 shrink-0">{{ entry.label }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 bar-fill"
                  :style="{ width: entry.pct + '%', background: entry.color }"
                />
              </div>
              <span class="text-[10px] font-medium text-gray-400 w-4 text-right">{{ entry.count }}</span>
            </div>
          </div>
        </div>

        <div class="shrink-0 hidden lg:block bg-primary rounded-2xl p-5 min-w-[200px]">
          <p class="text-[10px] font-medium uppercase tracking-widest text-white/60 mb-3">This week</p>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Commits</span>
              <span class="text-white font-bold font-medium">{{ thisWeek.commits }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Files changed</span>
              <span class="text-white font-bold font-medium">{{ thisWeek.filesChanged }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Lines added</span>
              <span class="text-accent font-bold font-medium">+{{ formatNum(thisWeek.linesAdded) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Lines removed</span>
              <span class="text-red-300 font-bold font-medium">−{{ formatNum(thisWeek.linesRemoved) }}</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-white/10">
            <p class="text-[10px] text-white/50 font-medium">{{ thisWeek.weekLabel }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ActivityThisWeek } from '~/types/activity'

const props = defineProps<{
  heatmap: Record<string, number>
  heatmapMonthLabel: string
  typeBreakdown: Record<string, number>
  thisWeek: ActivityThisWeek
}>()

const TYPE_COLORS: Record<string, string> = {
  Feature: '#738E6B',
  Design: '#A855F7',
  Content: '#22C55E',
  Fix: '#EF4444',
  Tool: '#F97316',
  Refactor: '#64748B',
  Perf: '#06B6D4',
  Docs: '#D97706',
}

const heatmapEntries = computed(() => {
  return Object.entries(props.heatmap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, count]) => ({ dateKey, count }))
})

const typeBreakdownEntries = computed(() => {
  const arr = Object.entries(props.typeBreakdown).filter(([, c]) => c > 0)
  const max = Math.max(1, ...arr.map(([, c]) => c))
  return arr.map(([label, count]) => ({
    label,
    count,
    pct: Math.round((count / max) * 100),
    color: TYPE_COLORS[label] || '#94A3B8',
  }))
})

function heatClass(count: number) {
  if (count === 0) return 'bg-gray-100'
  if (count === 1) return 'bg-amber-100'
  if (count === 2) return 'bg-amber-300'
  if (count === 3) return 'bg-amber-500'
  return 'bg-amber-700'
}

function heatTooltip(dateKey: string, count: number) {
  const d = new Date(dateKey + 'T12:00:00Z')
  const day = d.toLocaleDateString('en-US', { weekday: 'short' })
  const short = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (count === 0) return `${day} ${short} · no activity`
  return `${day} ${short} · ${count} commit${count > 1 ? 's' : ''}`
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toLocaleString()
}
</script>

<style scoped>
.bar-fill {
  height: 6px;
  border-radius: 9999px;
}
</style>
