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
    try {
      const db = await openDb()
      dbRef.value = db
      await loadAll()
      ready.value = true
      error.value = null
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
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const project: Project = {
      id: generateId(),
      title: title.trim() || 'Untitled Project',
      createdAt: Date.now()
    }
    await put(db, PROJECTS_STORE, project)
    projects.value = [...projects.value, project].sort((a, b) => a.createdAt - b.createdAt)
    return project
  }

  async function updateProject (id: string, updates: Partial<Pick<Project, 'title'>>) {
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const existing = projects.value.find(p => p.id === id)
    if (!existing) return
    const updated = { ...existing, ...updates }
    await put(db, PROJECTS_STORE, updated)
    projects.value = projects.value.map(p => p.id === id ? updated : p)
  }

  async function deleteProject (id: string) {
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const projectTodos = todos.value.filter(t => t.projectId === id)
    for (const t of projectTodos) {
      await del(db, TODOS_STORE, t.id)
    }
    await del(db, PROJECTS_STORE, id)
    projects.value = projects.value.filter(p => p.id !== id)
    todos.value = todos.value.filter(t => t.projectId !== id)
  }

  async function addTodo (projectId: string, title: string, content: string = '', status: TodoStatus = 'new'): Promise<Todo> {
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
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
  }

  async function updateTodo (id: string, updates: Partial<Pick<Todo, 'title' | 'content' | 'status' | 'order'>>) {
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    const existing = todos.value.find(t => t.id === id)
    if (!existing) return
    const updated = { ...existing, ...updates }
    await put(db, TODOS_STORE, updated)
    todos.value = todos.value.map(t => t.id === id ? updated : t).sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
  }

  async function deleteTodo (id: string) {
    const db = dbRef.value
    if (!db) throw new Error('Database not ready')
    await del(db, TODOS_STORE, id)
    todos.value = todos.value.filter(t => t.id !== id)
  }

  async function moveTodo (id: string, newStatus: TodoStatus) {
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
