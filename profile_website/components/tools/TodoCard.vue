<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
      <input
        v-if="editingTitle"
        ref="titleInputRef"
        v-model="localTitle"
        type="text"
        class="flex-1 min-w-0 px-2 py-1 text-sm font-bold text-primary bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary/20 border-none"
        @blur="saveTitle"
        @keydown.enter="saveTitle"
      />
      <span
        v-else
        class="flex-1 min-w-0 text-sm font-bold text-primary truncate cursor-pointer"
        @dblclick="editingTitle = true"
      >{{ todo.title || 'Untitled' }}</span>
      <div class="flex items-center gap-1 shrink-0">
        <select
          :value="todo.status"
          class="text-xs font-semibold rounded-lg border-none bg-gray-100 text-gray-600 py-1.5 pl-2 pr-6 focus:ring-2 focus:ring-primary/20 cursor-pointer"
          @change="onStatusChange(($event.target as HTMLSelectElement).value as TodoStatus)"
        >
          <option value="new">New</option>
          <option value="working">Working</option>
          <option value="done">Done</option>
        </select>
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          aria-label="Delete todo"
          @click="$emit('delete')"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="p-4">
      <textarea
        v-if="editingContent"
        ref="contentInputRef"
        v-model="localContent"
        rows="3"
        class="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 resize-none"
        placeholder="Add notes..."
        @blur="saveContent"
      />
      <p
        v-else
        class="text-sm text-gray-600 whitespace-pre-wrap min-h-[2rem] cursor-pointer rounded-lg py-1 -mx-1 hover:bg-gray-50/80"
        @dblclick="editingContent = true"
      >{{ todo.content || 'Add notes...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import type { Todo, TodoStatus } from '~/composables/useTodoDb'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'update', payload: Partial<Pick<Todo, 'title' | 'content' | 'status'>>): void
  (e: 'delete'): void
  (e: 'dragstart', todo: Todo): void
  (e: 'dragend'): void
}>()

const editingTitle = ref(false)
const editingContent = ref(false)
const localTitle = ref(props.todo.title)
const localContent = ref(props.todo.content)
const titleInputRef = ref<HTMLInputElement | null>(null)
const contentInputRef = ref<HTMLTextAreaElement | null>(null)

watch(() => props.todo.title, (v) => { localTitle.value = v })
watch(() => props.todo.content, (v) => { localContent.value = v })

function saveTitle () {
  editingTitle.value = false
  const t = localTitle.value?.trim()
  if (t !== undefined && t !== props.todo.title) emit('update', { title: t || 'Untitled' })
}

function saveContent () {
  editingContent.value = false
  const c = localContent.value ?? ''
  if (c !== props.todo.content) emit('update', { content: c })
}

function onStatusChange (status: TodoStatus) {
  emit('update', { status })
}

function onDragStart (e: DragEvent) {
  if (!e.dataTransfer) return
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.todo.id)
  e.dataTransfer.setData('application/json', JSON.stringify({ status: props.todo.status }))
  emit('dragstart', props.todo)
}

function onDragEnd () {
  emit('dragend')
}

watch(editingTitle, (v) => {
  if (v) nextTick(() => titleInputRef.value?.focus())
})
watch(editingContent, (v) => {
  if (v) nextTick(() => contentInputRef.value?.focus())
})
</script>
