<template>
  <div
    class="rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
    :class="day.isToday ? 'bg-primary' : 'bg-white border border-gray-100'"
  >
    <div
      class="flex items-center justify-between px-4 sm:px-5 py-3 border-b"
      :class="day.isToday ? 'border-white/10' : 'bg-gray-50 border-gray-100'"
    >
      <div class="flex items-center gap-2">
        <span
          class="font-medium text-xs"
          :class="day.isToday ? 'text-white/70' : 'text-gray-400'"
        >
          {{ day.dayOfWeek }}
        </span>
        <span
          class="font-bold text-base"
          :class="day.isToday ? 'text-white' : 'text-primary'"
        >
          {{ day.date }}
        </span>
        <span
          v-if="day.isToday"
          class="text-[10px] bg-accent text-primary font-bold px-2 py-0.5 rounded-full uppercase"
        >
          Today
        </span>
      </div>
      <span
        class="text-xs font-medium"
        :class="day.isToday ? 'text-white/50' : 'text-gray-400'"
      >
        {{ day.commits }} commit{{ day.commits !== 1 ? 's' : '' }}
      </span>
    </div>
    <div class="p-4 sm:p-5 space-y-3">
      <div
        v-for="(item, i) in day.items"
        :key="item.sha + i"
        class="flex gap-3"
      >
        <div
          class="commit-dot w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          :class="dotColor(i)"
        />
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap gap-1.5 mb-1">
            <span
              v-for="t in item.types"
              :key="t"
              class="activity-tag text-[10px] font-bold px-2 py-0.5 rounded-md"
              :class="tagClass(t)"
            >
              {{ t }}
            </span>
          </div>
          <div class="flex items-start justify-between gap-2">
            <p
              class="font-semibold text-sm flex-1 min-w-0"
              :class="day.isToday ? 'text-white' : 'text-primary'"
            >
              {{ item.title }}
            </p>
            <button
              v-if="item.description"
              type="button"
              class="shrink-0 text-[10px] font-medium underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded"
              :class="day.isToday ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-primary'"
              @click="toggleDescription(itemKey(item, i))"
            >
              {{ isExpanded(itemKey(item, i)) ? 'Hide' : 'Show description' }}
            </button>
          </div>
          <p
            v-if="item.description && isExpanded(itemKey(item, i))"
            class="text-xs mt-1 leading-relaxed"
            :class="day.isToday ? 'text-white/60' : 'text-gray-500'"
          >
            {{ item.description }}
          </p>
          <p
            class="text-[10px] font-medium mt-2"
            :class="day.isToday ? 'text-white/40' : 'text-gray-300'"
          >
            {{ item.sha }}
            <template v-if="item.files || item.additions || item.deletions">
              · {{ item.files || 0 }} files · +{{ item.additions || 0 }} −{{ item.deletions || 0 }}
            </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityDay } from '~/types/activity'

defineProps<{
  day: ActivityDay
}>()

const expanded = ref<Set<string>>(new Set())

function itemKey(item: { sha: string }, i: number) {
  return `${item.sha}-${i}`
}

function isExpanded(key: string) {
  return expanded.value.has(key)
}

function toggleDescription(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

const DOT_COLORS = ['bg-primary', 'bg-amber-400', 'bg-blue-400', 'bg-cyan-400', 'bg-purple-400', 'bg-slate-400']

function dotColor(i: number) {
  return DOT_COLORS[i % DOT_COLORS.length]
}

function tagClass(type: string) {
  const map: Record<string, string> = {
    Feature: 'activity-tag-feature',
    Fix: 'activity-tag-fix',
    Content: 'activity-tag-content',
    Tool: 'activity-tag-tool',
    Design: 'activity-tag-design',
    Refactor: 'activity-tag-refactor',
    Perf: 'activity-tag-perf',
    Docs: 'activity-tag-docs',
  }
  return map[type] || 'activity-tag-refactor'
}
</script>

<style scoped>
.commit-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
}
</style>
