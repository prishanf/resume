<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="relative pt-12 pb-12 overflow-hidden bg-inverse/85">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink
          to="/tools"
          class="inline-flex items-center text-xs font-bold text-accent uppercase tracking-[0.3em] mb-8 hover:text-primary transition-colors group"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter">
          Todo Board
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">
          Organize tasks by project. Drag cards between New, Working, and Done — all stored in your browser.
        </p>
      </div>
    </section>

    <!-- Project bar -->
    <section class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-gray-500 uppercase">Project</label>
            <select
              v-model="activeProjectId"
              class="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-primary min-w-[200px]"
            >
              <option value="" disabled>
                {{ projects.length ? 'Select project' : 'No projects' }}
              </option>
              <option v-for="p in projects" :key="p.id" :value="p.id">
                {{ p.title }}
              </option>
            </select>
          </div>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
            @click="showNewProject = true"
          >
            <PlusIcon class="w-4 h-4" />
            New project
          </button>
          <template v-if="activeProjectId">
            <button
              type="button"
              class="text-sm text-gray-500 hover:text-primary font-medium"
              @click="editProjectTitleId = activeProjectId"
            >
              Rename project
            </button>
            <button
              type="button"
              class="text-sm text-red-400 hover:text-red-600 font-medium"
              @click="confirmDeleteProject(activeProjectId)"
            >
              Delete project
            </button>
          </template>
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <!-- Loading / error -->
      <div v-if="!ready && !error" class="text-center py-12 text-gray-500">
        Loading...
      </div>
      <div v-if="error" class="rounded-2xl bg-red-50 border border-red-100 p-6 text-red-700">
        {{ error }}
      </div>

      <!-- No project selected -->
      <div
        v-else-if="ready && !activeProjectId && projects.length === 0"
        class="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
      >
        <p class="text-gray-600 mb-4">Create your first project to start adding todos.</p>
        <button
          type="button"
          class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          @click="showNewProject = true"
        >
          New project
        </button>
      </div>

      <div
        v-else-if="ready && !activeProjectId && projects.length > 0"
        class="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500"
      >
        Select a project above to view and manage todos.
      </div>

      <!-- Board: 3 columns -->
      <div
        v-else-if="ready && activeProjectId"
        class="md:grid md:grid-cols-3 gap-6 overflow-x-auto no-scrollbar pb-4 justify-between"
      >
        <ToolsTodoColumn
          status="new"
          label="New"
          :items="columnTodos('new')"
          :can-add="true"
          :content-visible="columnContentVisible.new"
          @update:content-visible="columnContentVisible.new = $event"
          @update="(id, u) => handleUpdateTodo(id, u)"
          @delete="handleDeleteTodo"
          @add="openAddTodo('new')"
          @drop="(id) => handleDrop(id, 'new')"
          @dragstart="draggingTodo = $event"
          @dragend="draggingTodo = null"
        />
        <ToolsTodoColumn
          status="working"
          label="Working"
          :items="columnTodos('working')"
          :can-add="true"
          :content-visible="columnContentVisible.working"
          @update:content-visible="columnContentVisible.working = $event"
          @update="(id, u) => handleUpdateTodo(id, u)"
          @delete="handleDeleteTodo"
          @add="openAddTodo('working')"
          @drop="(id) => handleDrop(id, 'working')"
          @dragstart="draggingTodo = $event"
          @dragend="draggingTodo = null"
        />
        <ToolsTodoColumn
          status="done"
          label="Done"
          :items="columnTodos('done')"
          :can-add="true"
          :content-visible="columnContentVisible.done"
          @update:content-visible="columnContentVisible.done = $event"
          @update="(id, u) => handleUpdateTodo(id, u)"
          @delete="handleDeleteTodo"
          @add="openAddTodo('done')"
          @drop="(id) => handleDrop(id, 'done')"
          @dragstart="draggingTodo = $event"
          @dragend="draggingTodo = null"
        />
      </div>
    </main>

    <!-- New project modal -->
    <div
      v-if="showNewProject"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showNewProject = false"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        <h3 class="text-lg font-black text-primary mb-4">New project</h3>
        <input
          v-model="newProjectTitle"
          type="text"
          placeholder="Project name"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm mb-4"
          @keydown.enter="submitNewProject"
        >
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
            @click="showNewProject = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90"
            @click="submitNewProject"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Rename project modal -->
    <div
      v-if="editProjectTitleId"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="editProjectTitleId = null"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        <h3 class="text-lg font-black text-primary mb-4">Rename project</h3>
        <input
          v-model="editProjectTitle"
          type="text"
          placeholder="Project name"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm mb-4"
          @keydown.enter="submitRenameProject"
        >
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
            @click="editProjectTitleId = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90"
            @click="submitRenameProject"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- New todo modal -->
    <div
      v-if="showAddTodoStatus !== null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showAddTodoStatus = null"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        <h3 class="text-lg font-black text-primary mb-4">New card</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
            <input
              v-model="newTodoTitle"
              type="text"
              placeholder="Task title"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm"
              @keydown.enter.prevent="submitNewTodo"
            >
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Content (optional)</label>
            <textarea
              v-model="newTodoContent"
              rows="4"
              placeholder="Plain text or **markdown**..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm resize-none font-mono"
            />
            <p class="text-[10px] text-gray-400 mt-1">Supports plain text and markdown (e.g. **bold**, lists, code).</p>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
            @click="showAddTodoStatus = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
            :disabled="!newTodoTitle.trim()"
            @click="submitNewTodo"
          >
            Add card
          </button>
        </div>
      </div>
    </div>

    <!-- Delete project confirm -->
    <div
      v-if="deleteProjectId"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="deleteProjectId = null"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        <h3 class="text-lg font-black text-primary mb-2">Delete project?</h3>
        <p class="text-sm text-gray-600 mb-4">
          This will remove the project and all its cards. This cannot be undone.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
            @click="deleteProjectId = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
            @click="doDeleteProject"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { TodoStatus } from '~/composables/useTodoDb'

const {
  projects,
  todos,
  todosByProject,
  ready,
  error,
  init,
  addProject,
  updateProject,
  deleteProject,
  addTodo,
  updateTodo,
  deleteTodo,
  moveTodo
} = useTodoDb()

const activeProjectId = ref<string | null>(null)
const showNewProject = ref(false)
const newProjectTitle = ref('')
const editProjectTitleId = ref<string | null>(null)
const editProjectTitle = ref('')
const deleteProjectId = ref<string | null>(null)
const showAddTodoStatus = ref<TodoStatus | null>(null)
const newTodoTitle = ref('')
const newTodoContent = ref('')
const draggingTodo = ref<any>(null)

const COLUMN_VISIBILITY_KEY = 'todo-board-column-content'
const columnContentVisible = ref<Record<TodoStatus, boolean>>({
  new: true,
  working: true,
  done: true
})

onMounted(() => {
  init()
  try {
    const raw = localStorage.getItem(COLUMN_VISIBILITY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, boolean>
      if (parsed.new !== undefined) columnContentVisible.value.new = parsed.new
      if (parsed.working !== undefined) columnContentVisible.value.working = parsed.working
      if (parsed.done !== undefined) columnContentVisible.value.done = parsed.done
    }
  } catch (_) {}
})

watch(columnContentVisible, (v) => {
  try {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(v))
  } catch (_) {}
}, { deep: true })

// When we have projects and no selection, select first
watch([projects, activeProjectId], () => {
  if (projects.value.length > 0 && !activeProjectId.value) {
    activeProjectId.value = projects.value[0].id
  }
}, { immediate: true })

const columnTodos = (status: TodoStatus) => {
  if (!activeProjectId.value) return []
  const list = (todosByProject.value[activeProjectId.value] || []).filter(t => t.status === status)
  return list.sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
}

function openAddTodo (status: TodoStatus) {
  showAddTodoStatus.value = status
  newTodoTitle.value = ''
  newTodoContent.value = ''
}

async function submitNewProject () {
  const title = newProjectTitle.value.trim()
  if (!title) return
  const p = await addProject(title)
  newProjectTitle.value = ''
  showNewProject.value = false
  activeProjectId.value = p.id
}

watch(editProjectTitleId, (id) => {
  if (id) {
    const p = projects.value.find(pr => pr.id === id)
    editProjectTitle.value = p?.title ?? ''
  }
})

async function submitRenameProject () {
  if (!editProjectTitleId.value) return
  await updateProject(editProjectTitleId.value, { title: editProjectTitle.value.trim() || 'Untitled' })
  editProjectTitleId.value = null
}

function confirmDeleteProject (id: string) {
  deleteProjectId.value = id
}

async function doDeleteProject () {
  if (!deleteProjectId.value) return
  await deleteProject(deleteProjectId.value)
  if (activeProjectId.value === deleteProjectId.value) {
    activeProjectId.value = projects.value[0]?.id ?? null
  }
  deleteProjectId.value = null
}

async function submitNewTodo () {
  const title = newTodoTitle.value.trim()
  if (!title || !activeProjectId.value || showAddTodoStatus.value === null) return
  await addTodo(activeProjectId.value, title, newTodoContent.value, showAddTodoStatus.value)
  showAddTodoStatus.value = null
  newTodoTitle.value = ''
  newTodoContent.value = ''
}

function handleUpdateTodo (id: string, u: Partial<{ title: string; content: string; status: TodoStatus; contentCollapsed: boolean }>) {
  updateTodo(id, u)
}

function handleDeleteTodo (id: string) {
  deleteTodo(id)
}

function handleDrop (todoId: string, newStatus: TodoStatus) {
  moveTodo(todoId, newStatus)
}

useSeoMeta({
  title: 'Todo Board - Prishan Fernando',
  description: 'Organize todos by project with New, Working, and Done columns. Data stored in your browser.'
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
