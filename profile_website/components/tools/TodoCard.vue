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

    <!-- Content area: respect column visibility first, then card-level collapsed -->
    <div v-if="columnContentVisible" class="p-4 pt-2">
      <!-- Column allows content: show card-level toggle or content -->
      <template v-if="contentCollapsed">
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors"
          @click="emit('update', { contentCollapsed: false })"
        >
          <ChevronDownIcon class="w-4 h-4" />
          Show content
        </button>
      </template>
      <template v-else>
        <div class="flex items-start justify-between gap-2 mb-1">
          <button
            type="button"
            class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors shrink-0"
            @click="emit('update', { contentCollapsed: true })"
          >
            <ChevronUpIcon class="w-4 h-4" />
            Hide content
          </button>
          <span class="text-[10px] text-gray-400 uppercase">Text & markdown</span>
        </div>
        <textarea
          v-if="editingContent"
          ref="contentInputRef"
          v-model="localContent"
          rows="6"
          class="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 resize-y font-mono"
          placeholder="Plain text or **markdown**..."
          @blur="saveContent"
        />
        <div
          v-else
          class="prose prose-sm prose-gray max-w-none min-h-[2rem] text-sm text-gray-600 rounded-lg py-1 -mx-1 px-1 cursor-pointer hover:bg-gray-50/80 todo-card-content"
          @dblclick="editingContent = true"
          v-html="renderedContent"
        />
      </template>
    </div>

    <!-- Column hiding content -->
    <div v-else class="px-4 py-2">
      <p class="text-xs text-gray-400 italic">
        Content hidden at column level
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { marked } from 'marked'
import type { Todo, TodoStatus } from '~/composables/useTodoDb'

const props = defineProps<{
  todo: Todo
  columnContentVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: Partial<Pick<Todo, 'title' | 'content' | 'status' | 'contentCollapsed'>>): void
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

const contentCollapsed = computed(() => props.todo.contentCollapsed === true)

const renderedContent = computed(() => {
  const raw = props.todo.content?.trim()
  if (!raw) return '<p class="text-gray-400">Add notes... (plain text or markdown)</p>'
  try {
    return marked.parse(raw, { async: false }) as string
  } catch {
    return escapeHtml(raw)
  }
})

function escapeHtml (s: string): string {
  const div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

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

<style scoped>
.todo-card-content :deep(p) {
  margin: 0.25em 0;
}
.todo-card-content :deep(p:first-child) {
  margin-top: 0;
}
/* Match posts [slug].vue: arrow bullet, accent color, hanging indent */
.todo-card-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0.5em 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.todo-card-content :deep(ol) {
  list-style: none;
  padding: 0;
  margin: 0.5em 0;
  counter-reset: todo-list;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.todo-card-content :deep(ol li) {
  counter-increment: todo-list;
  padding-left: 2rem;
  position: relative;
}
.todo-card-content :deep(ol li::before) {
  content: counter(todo-list) ".";
  position: absolute;
  left: 0;
  top: 0;
  color: #E8C16D; /* accent */
  font-weight: 700;
}
.todo-card-content :deep(ul li) {
  position: relative;
  padding-left: 2rem;
}
.todo-card-content :deep(ul li::before) {
  content: "→";
  position: absolute;
  left: 0;
  top: 0;
  color: #E8C16D; /* accent - matches posts */
  font-weight: 700;
}
.todo-card-content :deep(strong) {
  color: #738E6B; /* primary - bold green like posts */
  font-weight: 700;
}
.todo-card-content :deep(code) {
  font-size: 0.9em;
  background: rgb(243 244 246);
  padding: 0.1em 0.3em;
  border-radius: 0.25rem;
}
.todo-card-content :deep(pre) {
  margin: 0.5em 0;
  padding: 0.5em;
  background: rgb(243 244 246);
  border-radius: 0.5rem;
  overflow-x: auto;
}
.todo-card-content :deep(h1),
.todo-card-content :deep(h2),
.todo-card-content :deep(h3) {
  color: #738E6B; /* primary */
  font-weight: 700;
  margin: 0.5em 0 0.25em;
}
.todo-card-content :deep(h1) { font-size: 1.125em; }
.todo-card-content :deep(h2) { font-size: 1.0625em; }
.todo-card-content :deep(h3) { font-size: 1em; }
</style>
