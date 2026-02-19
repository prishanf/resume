/**
 * IndexedDB-backed store for projects and todos (Trello-style).
 * Data persists in the browser only.
 */

const DB_NAME = 'prishan-todo-board'
const DB_VERSION = 1
const PROJECTS_STORE = 'projects'
const TODOS_STORE = 'todos'

export type TodoStatus = 'new' | 'working' | 'done'

export interface Project {
  id: string
  title: string
  createdAt: number
}

export interface Todo {
  id: string
  projectId: string
  title: string
  content: string
  status: TodoStatus
  order: number
  createdAt: number
  /** When true, content is hidden at card level until user expands */
  contentCollapsed?: boolean
}

function openDb (): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
        const ps = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' })
        ps.createIndex('createdAt', 'createdAt', { unique: false })
      }
      if (!db.objectStoreNames.contains(TODOS_STORE)) {
        const ts = db.createObjectStore(TODOS_STORE, { keyPath: 'id' })
        ts.createIndex('projectId', 'projectId', { unique: false })
        ts.createIndex('projectId_status', ['projectId', 'status'], { unique: false })
        ts.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

function getAll<T> (db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || [])
  })
}

function put (db: IDBDatabase, storeName: string, value: object): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.put(value)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

function del (db: IDBDatabase, storeName: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/** Delete a project and all its todos in a single transaction (all-or-nothing). */
function deleteProjectWithTodos (db: IDBDatabase, projectId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([TODOS_STORE, PROJECTS_STORE], 'readwrite')
    const todoStore = tx.objectStore(TODOS_STORE)
    const projectStore = tx.objectStore(PROJECTS_STORE)
    const index = todoStore.index('projectId')
    const range = IDBKeyRange.only(projectId)
    const getReq = index.getAll(range)
    getReq.onerror = () => reject(getReq.error)
    getReq.onsuccess = () => {
      for (const todo of getReq.result as Todo[]) {
        todoStore.delete(todo.id)
      }
      projectStore.delete(projectId)
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

function generateId (): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function useTodoDb () {
  const projects = ref<Project[]>([])
  const todos = ref<Todo[]>([])
  const dbRef = ref<IDBDatabase | null>(null)
  const ready = ref(false)
  const error = ref<string | null>(null)

  async function init () {
    error.value = null
    try {
      const db = await openDb()
      dbRef.value = db
      await loadAll()
      ready.value = true
    } catch (e: any) {
      error.value = e?.message || 'Failed to open database'
      ready.value = false
    }
  }

  async function loadAll () {
    const db = dbRef.value
    if (!db) return
    const [proj, tod] = await Promise.all([
      getAll<Project>(db, PROJECTS_STORE),
      getAll<Todo>(db, TODOS_STORE)
    ])
    projects.value = proj.sort((a, b) => a.createdAt - b.createdAt)
    todos.value = tod.sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
  }

  async function addProject (title: string): Promise<Project> {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    try {
      const project: Project = {
        id: generateId(),
        title: title.trim() || 'Untitled Project',
        createdAt: Date.now()
      }
      await put(db, PROJECTS_STORE, project)
      projects.value = [...projects.value, project].sort((a, b) => a.createdAt - b.createdAt)
      return project
    } catch (e: any) {
      error.value = e?.message || 'Failed to create project'
      throw e
    }
  }

  async function updateProject (id: string, updates: Partial<Pick<Project, 'title'>>) {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const existing = projects.value.find(p => p.id === id)
    if (!existing) return
    try {
      const updated = { ...existing, ...updates }
      await put(db, PROJECTS_STORE, updated)
      projects.value = projects.value.map(p => p.id === id ? updated : p)
    } catch (e: any) {
      error.value = e?.message || 'Failed to update project'
      throw e
    }
  }

  async function deleteProject (id: string) {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    try {
      await deleteProjectWithTodos(db, id)
      projects.value = projects.value.filter(p => p.id !== id)
      todos.value = todos.value.filter(t => t.projectId !== id)
    } catch (e: any) {
      error.value = e?.message || 'Failed to delete project'
      throw e
    }
  }

  async function addTodo (projectId: string, title: string, content: string = '', status: TodoStatus = 'new'): Promise<Todo> {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    try {
      const maxOrder = Math.max(0, ...todos.value.filter(t => t.projectId === projectId && t.status === status).map(t => t.order))
      const todo: Todo = {
        id: generateId(),
        projectId,
        title: title.trim() || 'Untitled',
        content: (content || '').trim(),
        status,
        order: maxOrder + 1,
        createdAt: Date.now()
      }
      await put(db, TODOS_STORE, todo)
      todos.value = [...todos.value, todo].sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
      return todo
    } catch (e: any) {
      error.value = e?.message || 'Failed to add card'
      throw e
    }
  }

  async function updateTodo (id: string, updates: Partial<Pick<Todo, 'title' | 'content' | 'status' | 'order' | 'contentCollapsed'>>) {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const existing = todos.value.find(t => t.id === id)
    if (!existing) return
    try {
      const updated = { ...existing, ...updates }
      await put(db, TODOS_STORE, updated)
      todos.value = todos.value.map(t => t.id === id ? updated : t).sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
    } catch (e: any) {
      error.value = e?.message || 'Failed to update card'
      throw e
    }
  }

  async function deleteTodo (id: string) {
    error.value = null
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    try {
      await del(db, TODOS_STORE, id)
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (e: any) {
      error.value = e?.message || 'Failed to delete card'
      throw e
    }
  }

  async function moveTodo (id: string, newStatus: TodoStatus) {
    error.value = null
    const existing = todos.value.find(t => t.id === id)
    if (!existing || existing.status === newStatus) return
    const maxOrder = Math.max(0, ...todos.value.filter(t => t.projectId === existing.projectId && t.status === newStatus).map(t => t.order))
    await updateTodo(id, { status: newStatus, order: maxOrder + 1 })
  }

  const todosByProject = computed(() => {
    const byProject: Record<string, Todo[]> = {}
    for (const t of todos.value) {
      if (!byProject[t.projectId]) byProject[t.projectId] = []
      byProject[t.projectId].push(t)
    }
    for (const key of Object.keys(byProject)) {
      byProject[key].sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
    }
    return byProject
  })

  return {
    projects,
    todos,
    todosByProject,
    ready,
    error,
    init,
    loadAll,
    addProject,
    updateProject,
    deleteProject,
    addTodo,
    updateTodo,
    deleteTodo,
    moveTodo
  }
}
