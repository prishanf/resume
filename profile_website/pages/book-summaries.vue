<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-gray-50 to-primary/5 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div class="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-primary/5 rounded-full blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-8">
            <BookOpenIcon class="w-4 h-4" />
            <span>Book Summaries</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Productivity & <br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Learning.</span>
          </h1>

          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            PDF book summaries for morning listening and future reference.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content with Sidebar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
        <!-- Main Content (first on mobile, left on desktop) -->
        <main class="lg:col-span-3 min-w-0" aria-label="Book summaries list">
          <!-- Progress Dashboard -->
          <section class="py-2 sm:py-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 sm:mb-8 lg:sticky lg:top-20 lg:z-10">
            <div class="px-4 sm:px-6">
              <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">{{ summaries.length }}</div>
                    <div class="text-sm text-gray-500">Summaries</div>
                  </div>
                </div>
                <div class="flex items-center space-x-4 w-full md:w-auto">
                  <div class="relative flex-1">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search by title or author..."
                      class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>
                  <select
                    v-model="filter"
                    class="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary text-sm"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- List -->
          <section class="">
            
              <div v-if="pending" class="flex flex-col items-center justify-center py-6">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p class="text-gray-500 font-medium">Loading summaries...</p>
              </div>

              <div v-else-if="filteredSummaries.length > 0">
                <div class="mb-4 text-sm text-gray-500">
                  Showing {{ filteredSummaries.length }} of {{ summaries.length }} summar{{ summaries.length === 1 ? 'y' : 'ies' }}
                </div>

                <!-- Mobile: card list (no table) -->
                <div class="md:hidden space-y-3">
                  <div
                    v-for="summary in filteredSummaries"
                    :key="summary.id"
                    class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div class="flex gap-3">
                      <button
                        @click="toggleCompleted(summary.id)"
                        class="shrink-0 p-1 rounded-full transition-colors self-start mt-0.5"
                        :class="{
                          'bg-green-100 text-green-600 hover:bg-green-200': isCompleted(summary.id),
                          'bg-gray-100 text-gray-400 hover:bg-gray-200': !isCompleted(summary.id)
                        }"
                        :aria-label="isCompleted(summary.id) ? 'Mark incomplete' : 'Mark complete'"
                      >
                        <CheckCircleIcon v-if="isCompleted(summary.id)" class="w-5 h-5" />
                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        </svg>
                      </button>
                      <div class="min-w-0 flex-1">
                        <div class="font-medium text-primary">{{ summary.title }}</div>
                        <p class="text-gray-500 text-xs mt-0.5">
                          <span v-if="summary.day">Day {{ summary.day }}</span>
                          <template v-if="summary.day && summary.date"> · </template>
                          <span v-if="summary.date">{{ formatSummaryDate(summary.date) }}</span>
                        </p>
                        <p v-if="summary.description" class="text-gray-500 text-xs mt-1 line-clamp-2">
                          {{ summary.description }}
                        </p>
                        <p class="text-gray-500 text-xs mt-1">Summary by {{ summary.author }}</p>
                        <p v-if="summary.bookName || summary.bookAuthor" class="text-gray-600 text-xs mt-1">
                          <span v-if="summary.bookName">{{ summary.bookName }}</span>
                          <span v-if="summary.bookName && summary.bookAuthor"> by </span>
                          <span v-if="summary.bookAuthor">{{ summary.bookAuthor }}</span>
                        </p>
                        <div class="mt-3 flex flex-wrap gap-3">
                          <a
                            v-if="summary.sourceUrl"
                            :href="summary.sourceUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                          >
                            <PlayCircleIcon class="w-4 h-4 shrink-0" />
                            Watch
                          </a>
                          <a
                            v-else
                            href="https://www.youtube.com/@ProductivityGame/videos"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                          >
                            <PlayCircleIcon class="w-4 h-4 shrink-0" />
                            Channel
                          </a>
                          <a
                            :href="summary.pdfUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                          >
                            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                            View PDF
                          </a>
                          <a
                            :href="summary.pdfUrl"
                            :download="summary.title + '.pdf'"
                            class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                          >
                            <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                            Download
                          </a>
                          <a
                            v-if="summary.amazonUrl"
                            :href="summary.amazonUrl"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            class="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            Buy book
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desktop: table -->
                <div class="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="border-b border-gray-200 bg-gray-50/80">
                        <th class="py-3 px-4 w-10 text-center" scope="col">
                          <span class="sr-only">Done</span>
                        </th>
                        <th class="py-3 px-4 font-semibold text-primary text-sm">Title</th>
                        <th class="py-3 px-4 font-semibold primary text-sm">Summary Author</th>
                        <th class="py-3 px-4 font-semibold primary text-sm whitespace-nowrap">YouTube</th>
                        <th class="py-3 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="summary in filteredSummaries" :key="summary.id">
                        <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td class="py-3 px-4 text-center align-top">
                            <button
                              @click="toggleCompleted(summary.id)"
                              class="p-1 rounded-full transition-colors inline-flex"
                              :class="{
                                'bg-green-100 text-green-600 hover:bg-green-200': isCompleted(summary.id),
                                'bg-gray-100 text-gray-400 hover:bg-gray-200': !isCompleted(summary.id)
                              }"
                              :aria-label="isCompleted(summary.id) ? 'Mark incomplete' : 'Mark complete'"
                            >
                              <CheckCircleIcon v-if="isCompleted(summary.id)" class="w-5 h-5" />
                              <svg v-else class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                              </svg>
                            </button>
                          </td>
                          <td class="py-3 px-4 align-top">
                            <div class="font-medium text-primary pr-2">{{ summary.title }}</div>
                            <p class="text-gray-500 text-xs mt-0.5">
                              <span v-if="summary.day">Day {{ summary.day }}</span>
                              <template v-if="summary.day && summary.date"> · </template>
                              <span v-if="summary.date">{{ formatSummaryDate(summary.date) }}</span>
                            </p>
                            <p v-if="summary.bookName || summary.bookAuthor" class="text-xs capitalize mt-0.5">
                              <span v-if="summary.bookName" class="text-accent">{{ summary.bookName }}</span>
                              <span v-if="summary.bookName && summary.bookAuthor"> by </span>
                              <span v-if="summary.bookAuthor" class="font-bold italic text-primary">{{ summary.bookAuthor }}</span>
                            </p>
                            <p v-if="summary.description" class="text-gray-500 text-xs mt-0.5 line-clamp-2">
                              {{ summary.description }}
                            </p>
                          </td>
                          <td class="py-3 px-4 text-sm text-gray-600 align-top">
                            {{ summary.author }}
                          </td>
                          <td class="py-3 px-4 align-top">
                            <a
                              v-if="summary.sourceUrl"
                              :href="summary.sourceUrl"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
                            >
                              <PlayCircleIcon class="w-4 h-4 shrink-0" />
                              <span>Watch</span>
                            </a>
                            <a
                              v-else
                              href="https://www.youtube.com/@ProductivityGame/videos"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
                              title="Browse Productivity Game channel"
                            >
                              <PlayCircleIcon class="w-4 h-4 shrink-0" />
                              <span>Channel</span>
                            </a>
                          </td>
                          <td class="py-3 px-4 align-top">
                            <div class="flex flex-wrap gap-2 items-center">
                              <a
                                :href="summary.pdfUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                              >
                                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                                View
                              </a>
                              <a
                                :href="summary.pdfUrl"
                                :download="summary.title + '.pdf'"
                                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                              >
                                <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                                Download
                              </a>
                              <a
                                v-if="summary.amazonUrl"
                                :href="summary.amazonUrl"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                class="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                              >
                                Buy book
                              </a>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                v-else
                class="text-center py-24"
              >
                <BookOpenIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-primary mb-2">No summaries match your search</h3>
                <p class="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>

              <div v-if="error" class="text-center text-red-500 mt-8">
                Error: {{ error.message }}
              </div>
            
          </section>
        </main>

        <!-- Sidebar Intro (right on desktop, below content on mobile) -->
        <aside
          id="about-sidebar"
          class="lg:col-span-1 lg:sticky lg:top-20 lg:self-start bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
        >
          <h2 class="text-base sm:text-lg font-bold text-primary mb-5 tracking-tight">
            About This Page
          </h2>
          <div class="space-y-4 text-gray-600 text-xs  leading-relaxed">
            <p>
              I’ve built a small personal system around a habit that has quietly become one of the most valuable parts of my day.
            </p>
            <p>
              Every morning, without exception, I listen to a Productivity Game book summary. It’s my daily mental warm-up — short, focused, and packed with ideas I can reflect on.
            </p>
            <p>
              To make the habit more intentional, <br/> I created this personal dashboard where I:
            </p>
            <ul class="list-none space-y-2 pl-0">
              <li class="flex items-start gap-2">
                <span class="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Track the book summaries I’ve completed</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Store the downloaded PDFs for future reference</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Link directly to the original videos</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Monitor my progress and streak</span>
              </li>
            </ul>
            
            <p>
              <span class="font-medium text-primary">
              I want to thank Nathan Lozeron.
            </span>
              The value he has created through Productivity Game is remarkable. Distilling complex books into clear, practical insights has helped countless people (myself included) learn faster and think better.
            </p>
            <p>
              If you’re interested in continuous learning, I recommend his channel:
            </p>
            <a
              href="https://www.youtube.com/@ProductivityGame/videos"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors"
            >
              <span>Productivity Game</span>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 shrink-0" />
            </a>
            <p class="pt-2 text-gray-500 text-sm italic border-t border-gray-100 mt-4">
              Grateful for creators who make knowledge more accessible and for small habits that compound over time.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { BookOpenIcon, ArrowTopRightOnSquareIcon, ArrowDownTrayIcon, CheckCircleIcon, MagnifyingGlassIcon, PlayCircleIcon } from '@heroicons/vue/24/outline'

function formatSummaryDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const { data: summariesData, pending, error } = await useAsyncData('book-summaries', () =>
  import('~/data/summaries.json').then((m) => m.default).catch(() => ({ summaries: [] }))
)

const summaries = computed(() => summariesData.value?.summaries ?? [])

// Local storage for user data (must be initialized for SSR so userData[summary.id] is never undefined)
const userData = ref({})
const LOCAL_STORAGE_KEY = 'book-summaries-user-data'

watchEffect(() => {
  const list = summaries.value
  if (!list.length) return
  list.forEach((summary) => {
    if (!(summary.id in userData.value)) {
      userData.value[summary.id] = { completed: false, date: null, notes: '' }
    }
  })
})

onMounted(() => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      Object.keys(parsed).forEach((id) => {
        if (userData.value[id]) {
          userData.value[id] = { ...userData.value[id], ...parsed[id] }
        } else {
          userData.value[id] = { completed: false, date: null, notes: '', ...parsed[id] }
        }
      })
    } catch (_) {}
  }
})

const saveUserData = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData.value))
}

// Completed toggle
const toggleCompleted = (id) => {
  const item = userData.value[id]
  item.completed = !item.completed
  if (item.completed) {
    item.date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  } else {
    item.date = null
  }
  saveUserData()
}

const isCompleted = (id) => userData.value[id]?.completed || false

// Progress
const completedCount = computed(() => 
  Object.values(userData.value).filter(item => item.completed).length
)

// Streak calculation
const currentStreak = computed(() => {
  const dates = Object.values(userData.value)
    .filter(item => item.completed && item.date)
    .map(item => new Date(item.date))
    .sort((a, b) => b - a) // Descending

  if (!dates.length) return 0

  let streak = 1
  let current = new Date(dates[0])
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i])
    if (current - prev === 86400000) { // 1 day in ms
      streak++
      current = prev
    } else if (current - prev > 86400000) {
      break // Gap larger than 1 day, end current streak
    }
  }
  // Check if streak includes today/yesterday appropriately
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (dates[0].toDateString() !== today.toDateString() && dates[0].toDateString() !== yesterday.toDateString()) {
    return 0 // Streak broken if no recent completion
  }
  return streak
})

// Search and filter
const searchQuery = ref('')
const filter = ref('all')

const filteredSummaries = computed(() => {
  let filtered = summaries.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(summary => 
      summary.title.toLowerCase().includes(query) || 
      summary.author.toLowerCase().includes(query)
    )
  }

  if (filter.value === 'completed') {
    filtered = filtered.filter(summary => isCompleted(summary.id))
  } else if (filter.value === 'pending') {
    filtered = filtered.filter(summary => !isCompleted(summary.id))
  }

  return filtered
})

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl || 'https://prishanfernando.com').replace(/\/$/, '')
const pageUrl = `${siteUrl}/book-summaries`
const pageTitle = 'Book Summaries | Productivity Game PDFs - Prishan Fernando'
const pageDescription = 'Free PDF book summaries from Productivity Game by Nathan Lozeron. Browse and download summaries of best-selling books on productivity, leadership, and growth. Listen each morning and keep PDFs for reference.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: pageUrl,
  ogType: 'website',
  ogSiteName: 'Prishan Fernando',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

const structuredData = computed(() => {
  const list = summaries.value || []
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    publisher: {
      '@type': 'Person',
      name: 'Prishan Fernando',
      url: siteUrl,
    },
  }
  if (list.length > 0) {
    data.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.slice(0, 20).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: s.title,
          description: s.description || `Book summary: ${s.title}`,
          author: { '@type': 'Person', name: s.author },
          url: `${siteUrl}${s.pdfUrl}`,
        },
      })),
    }
  }
  return data
})

useHead(() => ({
  title: pageTitle,
  meta: [
    { name: 'robots', content: 'index, follow,' },
    { name: 'keywords', content: 'book summaries, PDF summaries, productivity books, leadership books, personal development, book notes, must read books, book recommendations,' },
  ],
  link: [
    { rel: 'canonical', href: pageUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value),
    },
  ],
}))
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>