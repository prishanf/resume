<template>
  <div :id="week.id" class="mb-12 scroll-mt-24">
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="activity-week-badge text-white text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full">
        Week {{ week.weekNum }}
      </div>
      <div class="text-sm text-gray-400 font-medium">{{ week.range }}</div>
      <div class="flex-1 min-w-0 h-px bg-gray-100" />
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] font-medium text-gray-400">{{ week.commits }} commits</span>
        <span class="w-1 h-1 bg-gray-300 rounded-full" />
        <span class="text-[10px] font-medium text-green-600">+{{ formatNum(week.linesAdded) }} lines</span>
      </div>
    </div>
    <div class="relative">
      <div
        class="activity-timeline-line absolute left-5 top-6 bottom-6 w-px bg-gray-200"
        aria-hidden="true"
      />
      <div
        v-for="d in week.days"
        :key="d.dateKey"
        class="flex gap-4 pb-8 last:pb-0"
      >
        <div class="w-10 flex-shrink-0 flex items-start justify-center pt-1.5">
          <div
            class="activity-timeline-node relative z-10 h-5 w-5 rounded-full border-2 bg-white"
            :class="d.isToday ? 'border-primary bg-primary' : 'border-gray-300'"
          />
        </div>
        <div class="flex-1 min-w-0 pt-0.5">
          <ActivitySummaryDayCard :day="d" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityWeek } from '~/types/activity'

defineProps<{
  week: ActivityWeek
}>()

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toLocaleString()
}
</script>

<style scoped>
.activity-week-badge {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
  background-color: #738E6B;
  box-shadow: 0 4px 12px rgba(115, 142, 107, 0.25);
}

.activity-timeline-line {
  background: linear-gradient(to bottom, rgb(218, 224, 235), rgba(196, 204, 222, 0.8));
}

.activity-timeline-node {
  box-shadow: 0 0 0 2px white;
}
</style>
