<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="hidden lg:block absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="hidden lg:block absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7">
            <p class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-6">Vancouver, BC</p>
            <h1 class="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tighter leading-[0.95]">
              Prishan Fernando
            </h1>
            <p class="text-lg md:text-2xl text-gray-600 mb-2 max-w-2xl font-medium leading-snug">
              AI Solutions Architect &amp; Builder.
            </p>
            <p class="text-sm md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              I solve real business problems with AI — not the other way around.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 items-start">
              <a
                :href="linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              >
                Work with me
                <ArrowRightIcon class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
              <NuxtLink
                to="/posts/"
                class="group inline-flex items-center px-8 py-4 bg-white text-primary border border-gray-100 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-inverse transition-all duration-300"
              >
                Read insights
              </NuxtLink>
            </div>
          </div>
          <div class="lg:col-span-5">
            <picture>
              <source
                media="(min-width: 1024px)"
                type="image/avif"
                srcset="/images/posts/me-640.avif"
              />
              <source
                media="(min-width: 1024px)"
                type="image/webp"
                srcset="/images/posts/me-640.webp"
              />
              <source
                media="(min-width: 1024px)"
                type="image/jpeg"
                srcset="/images/posts/me-640.jpg"
              />
              <source type="image/avif" srcset="/images/posts/me-384.avif" />
              <source type="image/webp" srcset="/images/posts/me-384.webp" />
              <img
                src="/images/posts/me-384.jpg"
                width="384"
                height="430"
                alt="Prishan Fernando"
                fetchpriority="high"
                decoding="async"
                class="w-36 h-36 mx-auto rounded-full object-cover shadow-md lg:w-full lg:h-auto lg:max-w-sm lg:ml-auto lg:rounded-3xl lg:shadow-2xl shadow-primary/10 border border-white"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>

    <!-- Problems I solve -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Problems I solve</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-primary leading-tight">Start with the business problem.</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article
            v-for="problem in problems"
            :key="problem.title"
            class="bg-inverse p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div class="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <component :is="problem.icon" class="w-6 h-6" />
            </div>
            <h4 class="text-lg font-bold text-primary mb-3">{{ problem.title }}</h4>
            <p class="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{{ problem.description }}</p>
            <div class="flex flex-col gap-2 text-sm font-bold">
              <NuxtLink :to="problem.expertiseHref" class="text-primary hover:text-accent transition-colors">
                {{ problem.expertiseLabel }} →
              </NuxtLink>
              <NuxtLink :to="problem.postHref" class="text-gray-500 hover:text-primary transition-colors">
                {{ problem.postLabel }} →
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Featured insights -->
    <section class="py-16 bg-inverse">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Featured insights</h2>
            <h3 class="text-4xl md:text-5xl font-bold text-primary">Writing on AI, automation, and experiments.</h3>
          </div>
          <NuxtLink to="/posts/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            All insights →
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PostCard
            v-for="post in featuredPosts"
            :key="post._path || post._id"
            :post="postWithoutRemoteImage(post)"
          />
        </div>
      </div>
    </section>

    <!-- Proof strip -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Proof</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-primary">Credentials, experience, and what people say.</h3>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-inverse p-6 rounded-2xl border border-gray-100">
            <div class="text-3xl font-black text-primary mb-1">20+</div>
            <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Years in software</div>
          </div>
          <div class="bg-inverse p-6 rounded-2xl border border-gray-100">
            <div class="text-3xl font-black text-primary mb-1">12+</div>
            <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Years Salesforce</div>
          </div>
          <div class="bg-inverse p-6 rounded-2xl border border-gray-100">
            <div class="text-3xl font-black text-primary mb-1">12+</div>
            <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Certifications</div>
          </div>
          <div class="bg-inverse p-6 rounded-2xl border border-gray-100">
            <div class="text-3xl font-black text-primary mb-1">Slalom</div>
            <div class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Director, Global Salesforce</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-10">
          <span
            v-for="cert in featuredCertifications"
            :key="cert.name"
            class="px-3 py-1.5 bg-inverse text-sm font-medium text-primary rounded-full border border-gray-100"
          >
            {{ cert.name }}
          </span>
          <NuxtLink to="/certifications/" class="px-3 py-1.5 text-sm font-bold text-accent hover:text-primary">
            All credentials →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <blockquote
            v-for="(rec, index) in featuredRecommendations"
            :key="index"
            class="bg-inverse p-8 rounded-2xl border border-gray-100"
          >
            <p class="text-gray-700 italic leading-relaxed mb-6">“{{ rec.quote }}”</p>
            <footer>
              <p class="font-bold text-primary">{{ rec.author }}</p>
              <p v-if="rec.title" class="text-sm text-gray-500 mt-1">{{ rec.title }}</p>
            </footer>
          </blockquote>
        </div>

        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/experience/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            Experience →
          </NuxtLink>
          <NuxtLink :to="{ path: '/experience/', hash: '#evidence' }" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            Evidence →
          </NuxtLink>
          <NuxtLink to="/endorsements/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            All endorsements →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section class="py-16 bg-inverse">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Tools</h2>
            <h3 class="text-4xl md:text-5xl font-bold text-primary">Free Canadian finance calculators</h3>
          </div>
          <NuxtLink to="/tools/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            All tools →
          </NuxtLink>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="tool in tools"
            :key="tool.href"
            :to="tool.href"
            class="group block p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            <h4 class="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">{{ tool.name }}</h4>
            <p class="text-sm text-gray-600 leading-relaxed">{{ tool.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Speaking & media -->
    <section v-if="latestPodcast" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Speaking &amp; media</h2>
            <h3 class="text-4xl md:text-5xl font-bold text-primary">Latest episode</h3>
          </div>
          <NuxtLink to="/speaking/" class="text-sm font-bold uppercase tracking-widest text-primary hover:text-accent">
            All media →
          </NuxtLink>
        </div>
        <div class="max-w-xl">
          <PostCard :post="postWithoutRemoteImage(latestPodcast)" />
        </div>
      </div>
    </section>

    <LayoutGetInTouch
      variant="page"
      title="Have a real business problem AI could solve? Let's talk."
      description="The best way to reach Prishan is on LinkedIn."
      button-label="Connect on LinkedIn"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowRightIcon,
  SparklesIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline'
import PostCard from '~/components/Blog/PostCard.vue'
import {
  LINKEDIN_PROFILE_URL,
  personJsonLd,
  websiteJsonLd
} from '~/utils/seo'

const linkedinUrl = LINKEDIN_PROFILE_URL

const problems = [
  {
    title: 'AI for real business problems',
    description: 'I start with the business problem, then apply AI — agents and automation, including Agentforce at work. Not a hunt for places to put a model.',
    icon: SparklesIcon,
    expertiseHref: { path: '/expertise/', hash: '#ai-solutions' },
    expertiseLabel: 'Expertise',
    postHref: '/posts/ai-cloud-transformation/',
    postLabel: 'Related insight'
  },
  {
    title: 'AI-assisted development',
    description: 'Hands-on AI-assisted software development, automation, and testing — Cursor, Claude Code, Copilot, and delivery frameworks used on real work.',
    icon: CodeBracketIcon,
    expertiseHref: { path: '/expertise/', hash: '#ai-assisted-development' },
    expertiseLabel: 'Expertise',
    postHref: '/posts/ai-coding-assistants-comparison-2026/',
    postLabel: 'Related insight'
  },
  {
    title: 'AI governance & security',
    description: 'Helping organizations evaluate AI vendors, data risk, and sector-specific controls before a single prompt goes to production.',
    icon: ShieldCheckIcon,
    expertiseHref: { path: '/expertise/', hash: '#ai-governance' },
    expertiseLabel: 'Expertise',
    postHref: '/posts/ai-governance-checklist-by-org-type/',
    postLabel: 'Related insight'
  },
  {
    title: 'Experiments with AI tools',
    description: 'I try the latest AI tools and bring back business use cases — this site, Canadian finance tools, and live experiments like micro-trading with an AI assistant.',
    icon: BeakerIcon,
    expertiseHref: { path: '/expertise/', hash: '#ai-experiments' },
    expertiseLabel: 'Expertise',
    postHref: '/posts/ai-micro-trading-experiment/',
    postLabel: 'Related insight'
  }
]

const tools = [
  {
    name: 'Mortgage Calculator',
    href: '/tools/mortgage-calculator/',
    description: 'Amortization, extra principal, term summary, and compare up to 3 scenarios.'
  },
  {
    name: 'Canadian Tax Calculator',
    href: '/tools/canadian-tax-calculator/',
    description: 'Federal and provincial tax estimate for salary, investments, RRSP, and rental income.'
  },
  {
    name: 'HELOC vs Mortgage Calculator',
    href: '/tools/heloc-mortgage-calculator/',
    description: 'Compare converting a HELOC to a fixed mortgage vs extra principal payments.'
  },
  {
    name: 'Rental Application',
    href: '/tools/rental-application/',
    description: 'Multi-step residential rental application with a downloadable PDF.'
  },
  {
    name: 'Todo Board',
    href: '/tools/todo-board/',
    description: 'Browser-based board with New, Working, and Done columns.'
  }
]

const featuredPostSlugs = [
  'ai-governance-checklist-by-org-type',
  'ai-coding-assistants-comparison-2026',
  'ai-micro-trading-experiment'
]

const featuredQuoteAuthors = ['Yi Zho', 'Morgan Cartier', 'Colleague']

const { data: posts } = await useAsyncData('home-featured-posts', () =>
  queryContent('posts')
    .where({ published: { $ne: false } })
    .only(['_path', '_id', 'title', 'excerpt', 'description', 'date', 'image', 'tags', 'published'])
    .find()
)

const { data: podcasts } = await useAsyncData('home-podcasts', () =>
  queryContent('podcasts')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .only(['_path', '_id', 'title', 'excerpt', 'description', 'date', 'image', 'tags', 'published'])
    .find()
)

const { data: certificationsContent } = await useAsyncData('home-certifications', () =>
  queryContent('/certifications').findOne()
)

const { data: recommendationsContent } = await useAsyncData('home-recommendations', () =>
  queryContent('/recommendations').findOne()
)

const featuredPosts = computed(() => {
  const bySlug = new Map(
    (posts.value || []).map((post) => {
      const slug = String(post._path || '').split('/').filter(Boolean).pop()
      return [slug, post]
    })
  )
  return featuredPostSlugs.map((slug) => bySlug.get(slug)).filter(Boolean)
})

const latestPodcast = computed(() => (podcasts.value && podcasts.value[0]) || null)

const allCertifications = computed(() => certificationsContent.value?.certifications || [])
const featuredCertifications = computed(() => {
  const featured = allCertifications.value.filter((cert) => cert.badge === 'Featured' || cert.badge === 'New')
  return featured.length ? featured : allCertifications.value.slice(0, 4)
})
const featuredRecommendations = computed(() => {
  const all = recommendationsContent.value?.recommendations || []
  return featuredQuoteAuthors
    .map((author) => all.find((rec) => rec.author === author))
    .filter(Boolean)
})

function postWithoutRemoteImage (post) {
  if (!post) return post
  const image = post.image
  if (image && String(image).startsWith('http')) {
    const { image: _ignored, ...rest } = post
    return rest
  }
  return post
}

const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: 'Prishan Fernando — AI Solutions Architect & Builder',
  description: 'AI Solutions Architect & Builder in Vancouver, BC. I solve real business problems with AI — not the other way around. Insights and experiments from Slalom.',
  jsonLd: () => [personJsonLd(siteUrl), websiteJsonLd(siteUrl)]
})
</script>
