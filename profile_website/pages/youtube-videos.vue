<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-gray-50 to-primary/5 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div class="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-primary/5 rounded-full blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-8">
            <VideoCameraIcon class="w-4 h-4" />
            <span>YouTube Videos</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Videos I’ve <br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Watched & Summarized.</span>
          </h1>

          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            YouTube videos I found valuable, with short summaries and tags for quick reference.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content with Sidebar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
        <main class="lg:col-span-3 min-w-0" aria-label="YouTube videos list">
          <!-- Dashboard -->
          <section class="py-2 sm:py-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 sm:mb-8 lg:sticky lg:top-20 lg:z-10">
            <div class="px-4 sm:px-6">
              <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">{{ videos.length }}</div>
                    <div class="text-sm text-gray-500">Videos</div>
                  </div>
                </div>
                <div class="flex items-center space-x-4 w-full md:w-auto flex-wrap">
                  <div class="relative flex-1 min-w-[180px]">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search title, summary, tags..."
                      class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>
                  <select
                    v-model="tagFilter"
                    class="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary text-sm"
                  >
                    <option value="">All tags</option>
                    <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- List -->
          <section>
            <div v-if="pending" class="flex flex-col items-center justify-center py-6">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p class="text-gray-500 font-medium">Loading videos...</p>
            </div>

            <div v-else-if="filteredVideos.length > 0">
              <div class="mb-4 text-sm text-gray-500">
                Showing {{ filteredVideos.length }} of {{ videos.length }} video{{ videos.length === 1 ? '' : 's' }}
              </div>

              <!-- Card list (same layout for mobile and desktop) -->
              <div class="space-y-3">
                <div
                  v-for="video in filteredVideos"
                  :key="video.id"
                  class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <div class="flex gap-3 sm:gap-4">
                    <a
                      v-if="video.videoUrl"
                      :href="video.videoUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="shrink-0 block w-24 h-[54px] sm:w-32 sm:h-[72px] rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        :src="youtubeThumbnail(video.videoUrl)"
                        :alt="video.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </a>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-start justify-between gap-2">
                        <a
                          v-if="video.videoUrl"
                          :href="video.videoUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-medium text-primary hover:text-accent transition-colors line-clamp-2"
                        >
                          {{ video.title }}
                        </a>
                        <span v-else class="font-medium text-primary">{{ video.title }}</span>
                        <span v-if="video.watchedDate" class="text-gray-500 text-xs shrink-0">{{ formatDate(video.watchedDate) }}</span>
                      </div>
                      <!-- Tags: horizontal -->
                      <div v-if="video.tags?.length" class="mt-2 flex flex-wrap gap-1.5">
                        <span
                          v-for="tag in video.tags"
                          :key="tag"
                          class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs"
                        >
                          {{ tag }}
                        </span>
                      </div>
                      <!-- Summary: toggle show/hide, markdown rendered -->
                      <div v-if="video.summary" class="mt-3">
                        <button
                          type="button"
                          @click="toggleSummary(video.id)"
                          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
                        >
                          <ChevronDownIcon
                            class="w-4 h-4 shrink-0 transition-transform duration-200"
                            :class="{ 'rotate-180': expandedSummaries.has(video.id) }"
                          />
                          {{ expandedSummaries.has(video.id) ? 'Hide summary' : 'Show summary' }}
                        </button>
                        <div
                          v-show="expandedSummaries.has(video.id)"
                          class="mt-2 pl-1 text-gray-600 text-sm leading-relaxed prose prose-sm prose-primary max-w-none youtube-summary"
                          v-html="renderMarkdown(video.summary)"
                        />
                      </div>
                      <a
                        v-if="video.videoUrl"
                        :href="video.videoUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent mt-3 transition-colors"
                      >
                        <PlayCircleIcon class="w-4 h-4 shrink-0" />
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center py-24"
            >
              <VideoCameraIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-xl font-bold text-primary mb-2">No videos match your search</h3>
              <p class="text-gray-500">Try changing the search or tag filter.</p>
            </div>
          </section>
        </main>

        <!-- Sidebar -->
        <aside
          class="lg:col-span-1 lg:sticky lg:top-20 lg:self-start bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
        >
          <h2 class="text-base sm:text-lg font-bold text-primary mb-5 tracking-tight">
            About This Page
          </h2>
          <div class="space-y-4 text-gray-600 text-xs leading-relaxed">
            <p>
              I keep a list of YouTube videos I’ve watched and found worth remembering — with a short summary and tags so I can find them again.
            </p>
            <p>
              The list is maintained in a <strong class="text-primary">Google Sheet</strong>. The sheet must be shared so <strong>“Anyone with the link can view”</strong>. The site is static (e.g. GitHub Pages): the sheet is fetched at build time and saved as data/youtube-videos.json. Run npm run sync-youtube-videos before generate (or rely on the build script). Share the sheet so anyone with the link can view, and set NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS in your env (e.g. GitHub Actions secrets).
            </p>
            <p class="font-medium text-primary">Sheet columns:</p>
            <ul class="list-none space-y-1 pl-0">
              <li><strong>Title</strong> — video title</li>
              <li><strong>Video URL</strong> — full YouTube link</li>
              <li><strong>Channel</strong> — channel name</li>
              <li><strong>Summary</strong> — short summary (Markdown supported: **bold**, lists, links, etc.)</li>
              <li><strong>Tags</strong> — comma-separated (e.g. productivity, coding)</li>
              <li><strong>Watched Date</strong> — when you watched it (any date format)</li>
            </ul>
            <p>
              Sheet ID is in the URL: <code class="bg-gray-100 px-1 rounded text-[11px] break-all">.../d/<strong>SHEET_ID</strong>/edit</code>. See <code class="bg-gray-100 px-1 rounded text-[11px]">docs/youtube-videos-google-sheet-setup.md</code> for full setup.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VideoCameraIcon, MagnifyingGlassIcon, PlayCircleIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { marked } from 'marked'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Get YouTube thumbnail URL from watch URL. */
function youtubeThumbnail(url) {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  const id = m ? m[1] : ''
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''
}

// Static data for GitHub Pages: run `npm run sync-youtube-videos` before build/generate
const { data: videosData, pending } = await useAsyncData('youtube-videos', () =>
  import('~/data/youtube-videos.json').then((m) => m.default).catch(() => ({ videos: [] }))
)

const videos = computed(() => videosData.value?.videos ?? [])

const allTags = computed(() => {
  const set = new Set()
  videos.value.forEach((v) => (v.tags || []).forEach((t) => set.add(t)))
  return Array.from(set).sort()
})

const searchQuery = ref('')
const tagFilter = ref('')
const expandedSummaries = ref(new Set())

function toggleSummary(id) {
  const next = new Set(expandedSummaries.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedSummaries.value = next
}

function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text, { async: false })
}

const filteredVideos = computed(() => {
  let list = videos.value
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        (v.summary && v.summary.toLowerCase().includes(q)) ||
        (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
    )
  }
  if (tagFilter.value) {
    list = list.filter((v) => v.tags && v.tags.includes(tagFilter.value))
  }
  return list
})

const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl || 'https://prishanfernando.com').replace(/\/$/, '')
const pageUrl = `${siteUrl}/youtube-videos`
const pageTitle = 'YouTube Videos I Watched | Video Summaries - Prishan Fernando'
const pageDescription = 'A curated list of YouTube videos I’ve watched with short summaries and tags. Productivity, learning, and tech recommendations.'

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
  const list = filteredVideos.value || []
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    publisher: { '@type': 'Person', name: 'Prishan Fernando', url: siteUrl },
    mainEntity:
      list.length > 0
        ? {
            '@type': 'ItemList',
            numberOfItems: list.length,
            itemListElement: list.slice(0, 20).map((v, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'VideoObject',
                name: v.title,
                description: v.summary || v.title,
                url: v.videoUrl,
                uploadDate: v.watchedDate,
              },
            })),
          }
        : undefined,
  }
})

useHead(() => ({
  title: pageTitle,
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'keywords', content: 'YouTube videos, video summaries, productivity videos, learning, recommendations' },
  ],
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value),
    },
  ],
}))
</script>

<style scoped>
.youtube-summary :deep(p) { margin: 0.5em 0; }
.youtube-summary :deep(p:first-child) { margin-top: 0; }
.youtube-summary :deep(ul), .youtube-summary :deep(ol) { margin: 0.5em 0; padding-left: 1.25rem; }
.youtube-summary :deep(li) { margin: 0.25em 0; }
.youtube-summary :deep(strong) { font-weight: 600; color: var(--color-primary, #738E6B); }
.youtube-summary :deep(a) { color: var(--color-primary, #738E6B); text-decoration: underline; }
.youtube-summary :deep(a:hover) { color: var(--color-accent, #E8C16D); }
.youtube-summary :deep(code) { font-size: 0.9em; padding: 0.15em 0.35em; border-radius: 4px; background: rgb(243 244 246); }
.youtube-summary :deep(pre) { margin: 0.5em 0; padding: 0.75rem; border-radius: 6px; background: rgb(243 244 246); overflow-x: auto; }
.youtube-summary :deep(pre code) { padding: 0; background: none; }
.youtube-summary :deep(h1), .youtube-summary :deep(h2), .youtube-summary :deep(h3) { font-weight: 600; margin: 0.75em 0 0.35em; }
.youtube-summary :deep(blockquote) { margin: 0.5em 0; padding-left: 1rem; border-left: 3px solid rgb(203 213 225); color: rgb(100 116 139); }
</style>
