<template>
  <div
    class="flex flex-col rounded-2xl border border-gray-100 bg-gray-50/50 min-h-[320px] w-full max-w-[360px] shrink-0"
    :data-status="status"
    @dragover.prevent="allowDrop = true"
    @dragleave="allowDrop = false"
    @drop="onDrop"
  >
    <div
      :class="[
        'px-4 py-3 rounded-t-2xl border-b border-gray-100',
        status === 'new' && 'bg-sky-50 border-sky-100',
        status === 'working' && 'bg-amber-50 border-amber-100',
        status === 'done' && 'bg-green-50 border-green-100'
      ]"
    >
      <div class="flex items-center justify-between gap-2 mb-2">
        <span
          :class="[
            'text-xs font-black uppercase tracking-wide',
            status === 'new' && 'text-sky-700',
            status === 'working' && 'text-amber-800',
            status === 'done' && 'text-green-700'
          ]"
        >{{ label }}</span>
        <span class="text-sm font-bold text-gray-500 tabular-nums">{{ items.length }}</span>
      </div>
      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          :class="[
            'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors rounded-lg px-2 py-1',
            contentVisible
              ? 'text-gray-600 hover:text-primary bg-white/60'
              : 'text-gray-400 hover:text-gray-600'
          ]"
          :title="contentVisible ? 'Hide content in this column' : 'Show content in this column'"
          @click="$emit('update:contentVisible', !contentVisible)"
        >
          <EyeIcon v-if="contentVisible" class="w-3.5 h-3.5" />
          <EyeSlashIcon v-else class="w-3.5 h-3.5" />
          {{ contentVisible ? 'Content on' : 'Content off' }}
        </button>
      </div>
    </div>
    <div
      :class="[
        'flex-1 p-3 space-y-3 overflow-y-auto transition-colors',
        allowDrop && 'bg-primary/5 ring-2 ring-primary/20 ring-inset rounded-b-2xl'
      ]"
    >
      <template v-for="todo in items" :key="todo.id">
        <ToolsTodoCard
          :todo="todo"
          :column-content-visible="contentVisible"
          @update="(u) => $emit('update', todo.id, u)"
          @delete="$emit('delete', todo.id)"
          @dragstart="$emit('dragstart', $event)"
          @dragend="$emit('dragend')"
        />
      </template>
      <button
        v-if="canAdd"
        type="button"
        class="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:text-primary hover:bg-white/80 transition-colors"
        @click="$emit('add')"
      >
        <PlusIcon class="w-4 h-4" />
        Add card
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import type { Todo, TodoStatus } from '~/composables/useTodoDb'

const props = withDefaults(
  defineProps<{
    status: TodoStatus
    label: string
    items: Todo[]
    canAdd?: boolean
    /** Column-level: show/hide content for all cards in this column */
    contentVisible?: boolean
  }>(),
  { canAdd: true, contentVisible: true }
)

const emit = defineEmits<{
  (e: 'update', id: string, payload: Partial<Pick<Todo, 'title' | 'content' | 'status' | 'contentCollapsed'>>): void
  (e: 'delete', id: string): void
  (e: 'add'): void
  (e: 'drop', todoId: string): void
  (e: 'dragstart', todo: Todo): void
  (e: 'dragend'): void
  (e: 'update:contentVisible', value: boolean): void
}>()

const allowDrop = ref(false)

function onDrop (e: DragEvent) {
  allowDrop.value = false
  e.preventDefault()
  const id = e.dataTransfer?.getData('text/plain')
  if (id) emit('drop', id)
}
</script>
