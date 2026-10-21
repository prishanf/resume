<template>
  <div class="min-h-screen">
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <MicrophoneIcon class="w-4 h-4" />
            <span>Speaking &amp; Media</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Speaking &amp; <br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Media.</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Podcast episodes and video notes on AI, architecture, security, and how work gets done.
          </p>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Podcasts</h2>
              <h3 class="text-3xl font-bold text-primary">Episodes</h3>
            </div>
            <NuxtLink to="/podcasts/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
              All podcasts →
            </NuxtLink>
          </div>
          <div v-if="podcasts && podcasts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PostCard
              v-for="podcast in podcasts"
              :key="podcast._path || podcast._id"
              :post="podcast"
            />
          </div>
          <p v-else class="text-gray-500">No episodes yet.</p>
        </div>

        <div>
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">YouTube</h2>
              <h3 class="text-3xl font-bold text-primary">Videos I’ve watched and summarized</h3>
            </div>
            <NuxtLink to="/youtube-videos/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
              All video notes →
            </NuxtLink>
          </div>
          <div v-if="videos.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              v-for="video in videos.slice(0, 4)"
              :key="video.id"
              :href="video.videoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block p-6 rounded-2xl border border-gray-100 bg-inverse hover:shadow-lg transition-shadow"
            >
              <h4 class="text-lg font-bold text-primary mb-2">{{ video.title }}</h4>
              <p v-if="video.watchedDate" class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {{ video.watchedDate }}
              </p>
              <p class="text-sm text-gray-600 line-clamp-3">{{ videoPlainSummary(video.summary) }}</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { MicrophoneIcon } from '@heroicons/vue/24/outline'
import PostCard from '~/components/Blog/PostCard.vue'
import youtubeVideos from '~/data/youtube-videos.json'
import { personJsonLd, webPageJsonLd } from '~/utils/seo'

const { data: podcasts } = await useAsyncData('speaking-podcasts', () =>
  queryContent('podcasts')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find()
)

const videos = youtubeVideos.videos || []

function videoPlainSummary (summary) {
  if (!summary) return ''
  return String(summary).replace(/[#*_`]/g, '').replace(/\n+/g, ' ').trim()
}

const pageTitle = 'Speaking & Media | Prishan Fernando'
const pageDescription = 'Podcast episodes and YouTube notes from Prishan Fernando on AI security, architecture, and how work gets planned and done.'

const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  jsonLd: () => [
    personJsonLd(siteUrl),
    webPageJsonLd({
      siteUrl,
      path: '/speaking/',
      name: pageTitle,
      description: pageDescription
    })
  ]
})
</script>
