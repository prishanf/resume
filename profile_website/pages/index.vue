<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Available for Strategic Leadership</span>
          </div>
          
          <h1 class="text-6xl md:text-8xl font-black text-primary mb-8 tracking-tighter leading-[0.9]">
            Prishan <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Fernando.</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl font-medium leading-relaxed">
            Technology leader and architect specializing in <span class="text-primary border-b-2 border-accent/30">AI-enabled cloud transformation</span> and enterprise multi-cloud ecosystems.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 items-start">
            <NuxtLink to="/experience" class="group flex items-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
              View Professional Journey 
              <ArrowRightIcon class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </NuxtLink>
            <NuxtLink to="/about" class="group flex items-center px-8 py-4 bg-white text-primary border border-gray-100 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-inverse transition-all duration-300">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Executive Summary Section -->
    <section v-if="summary" class="py-16 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div class="lg:col-span-5">
            <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">The Overview</h2>
            <h3 class="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              Technology Leader & <br/>Strategic Architect
            </h3>
            <p class="text-lg text-gray-600 leading-relaxed mb-8">
              Hands-on architect with over 20 years in software development and 12+ years specializing in Salesforce ecosystems. Known for translating complex business challenges into pragmatic, scalable solutions while building high-trust teams.
            </p>
            <div class="flex items-center space-x-6">
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">20+</span>
                <span class="text-xs text-gray-400 uppercase tracking-widest">Years Dev</span>
              </div>
              <div class="w-px h-10 bg-gray-200"></div>
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">12+</span>
                <span class="text-xs text-gray-400 uppercase tracking-widest">Years SF</span>
              </div>
              <div class="w-px h-10 bg-gray-200"></div>
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">100+</span>
                <span class="text-xs text-gray-400 uppercase tracking-widest">Interviews</span>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-inverse p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div class="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <BriefcaseIcon class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-primary mb-3">Enterprise Architecture</h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                Specializing in multi-cloud programs (Sales, Service, Experience, CPQ) with complex integrations and large-scale data migrations.
              </p>
            </div>
            
            <div class="bg-inverse p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div class="w-12 h-12 bg-accent text-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                <SparklesIcon class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-primary mb-3">AI & Acceleration</h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                Pioneering AI-assisted delivery frameworks that cut manual effort by ~70% and produce reusable enterprise toolkits.
              </p>
            </div>
            
            <div class="bg-inverse p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div class="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
                <UserGroupIcon class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-primary mb-3">People-First Leadership</h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                Dedicated mentor and practice lead focused on building high-performing teams and developing future technical architects.
              </p>
            </div>
            
            <div class="bg-inverse p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 md:mt-0">
              <div class="w-12 h-12 bg-gray-800 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-gray-800/20">
                <ChartBarIcon class="w-6 h-6" />
              </div>
              <h4 class="text-lg font-bold text-primary mb-3">Strategic Alignment</h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                Expert at making complex technical concepts accessible and actionable for executive stakeholders and non-technical audiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Key Highlights Section -->
    <section class="py-16 bg-inverse relative overflow-hidden">
      <div class="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] -skew-x-12"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-20">
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Core Strengths</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-primary">Strategic <br/>Key Highlights.</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(card, index) in summaryCards"
            :key="card.title"
            :class="[
              index === summaryCards.length - 1 && summaryCards.length % 3 === 1
                ? 'md:col-span-2 lg:col-span-3'
                : ''
            ]"
          >
            <SummaryCard
              :title="card.title"
              :description="card.description"
              :icon="card.icon"
              :metrics="card.metrics"
              :link="card.link"
            />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Career Timeline Section -->
    <CareerTimeline :timeline-data="timelineData" />
    
    <!-- Recommendations Section -->
    <section v-if="recommendations && recommendations.length > 0" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-20 text-right">
          <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Endorsements</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-primary">What People <br/>Actually Say.</h3>
        </div>
        <Recommendations
          :recommendations="featuredRecommendations"
          :show-view-more="recommendations.length > featuredRecommendations.length"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  RocketLaunchIcon
} from '@heroicons/vue/24/outline'

// Explicitly import components to ensure they're available
import SummaryCard from '~/components/Sections/SummaryCard.vue'
import Recommendations from '~/components/Sections/Recommendations.vue'
import CareerTimeline from '~/components/Sections/CareerTimeline.vue'

const { data: summary } = await useAsyncData('summary', () => queryContent('/summary').findOne())

// Load summaryCards from content/summary-cards.md so they can be managed via content
import { computed } from 'vue'

const iconMap = {
  BriefcaseIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  RocketLaunchIcon
}

// Fetch the summary cards from markdown frontmatter/content
const { data: summaryCardsContent } = await useAsyncData('summary-cards', () =>
  queryContent('/summary-cards').findOne()
)

const summaryCards = computed(() => {
  // Assume the .md file exports an array frontmatter field called cards
  return (summaryCardsContent.value?.cards || []).map(card => ({
    ...card,
    icon: iconMap[card.icon] || BriefcaseIcon // fallback icon
  }))
})

// Fetch and parse experience data for timeline
const { data: experienceRaw } = await useAsyncData('experience-timeline', () => 
  queryContent('/experience').findOne()
)

// Parse experience data into timeline format
const { parseExperienceToTimeline } = useCareerTimeline()
const timelineData = computed(() => {
  if (!experienceRaw.value) return []
  
  // Parse the experience content - handle both string and object formats
  const content = typeof experienceRaw.value === 'string' 
    ? experienceRaw.value 
    : experienceRaw.value.body?.children 
      ? extractTextFromBody(experienceRaw.value.body)
      : ''
  
  return parseExperienceToTimeline(content || experienceRaw.value)
})

// Helper function to extract text from Nuxt Content body structure
function extractTextFromBody(body) {
  if (!body || !body.children) return ''
  
  let text = ''
  body.children.forEach(child => {
    if (child.type === 'text') {
      text += child.value + '\n'
    } else if (child.type === 'element') {
      if (child.tag === 'h3' || child.tag === 'h4') {
        text += extractTextFromElement(child) + '\n'
      } else if (child.tag === 'ul' || child.tag === 'p') {
        text += extractTextFromElement(child) + '\n'
      }
    }
  })
  
  return text
}

function extractTextFromElement(element) {
  if (element.type === 'text') {
    return element.value || ''
  }
  
  if (element.children) {
    return element.children.map(child => extractTextFromElement(child)).join('')
  }
  
  return ''
}

// The data for the cards is now stored in profile_website/content/summary-cards.md:
// ---
// cards:
//   - title: "Experience"
//     description: "20+ years in software development, 12+ years in Salesforce architecture"
//     icon: "BriefcaseIcon"
//     metrics:
//       - value: "20+"
//         label: "Years Experience"
//       - value: "12+"
//         label: "Years Salesforce"
//     link: "/experience"
//   - title: "Leadership"
//     description: "Built high-performing teams and conducted 100+ interviews"
//     icon: "UserGroupIcon"
//     metrics:
//       - value: "100+"
//         label: "Interviews Conducted"
//     link: "/about"
//   - title: "AI Innovation"
//     description: "Pioneered AI-assisted frameworks reducing effort by 70%"
//     icon: "SparklesIcon"
//     metrics:
//       - value: "70%"
//         label: "Effort Reduction"
//     link: "/about"
//   - title: "Certifications"
//     description: "12+ Salesforce certifications including AI Associate and Experience Cloud"
//     icon: "TrophyIcon"
//     metrics:
//       - value: "12+"
//         label: "Certifications"
//     link: "/certifications"
//   - title: "Utilization"
//     description: "Consistently exceeding targets with 93% average utilization"
//     icon: "ChartBarIcon"
//     metrics:
//       - value: "93%"
//         label: "Average Utilization"
//       - value: "115%"
//         label: "Peak Utilization"
//     link: "/experience"
//   - title: "Education"
//     description: "BSc in Computer Science from Minnesota State University"
//     icon: "AcademicCapIcon"
//     link: "/education"
// ---

// Load recommendations from content/recommendations.md so they can be managed via content
const { data: recommendationsContent } = await useAsyncData('recommendations', () =>
  queryContent('/recommendations').findOne()
)

const recommendations = computed(() => {
  // Extract recommendations from markdown frontmatter
  return recommendationsContent.value?.recommendations || []
})

const featuredRecommendations = computed(() => {
  const all = recommendations.value
  const featured = all.filter(r => r.featured === true)
  return featured.length > 0 ? featured : all.slice(0, 4)
})

useHead({
  title: 'Prishan Fernando - Technology Leader & Salesforce Architect',
  meta: [
    { name: 'description', content: 'Technology leader and hands-on architect with 20+ years in software development and 12+ years specializing in Salesforce architecture' }
  ]
})
</script>

<style scoped>
:deep(.prose h1) {
  @apply text-3xl font-bold text-primary mb-4;
}

:deep(.prose h2) {
  @apply text-2xl font-bold text-primary mt-8 mb-4;
}

:deep(.prose h3) {
  @apply text-xl font-bold text-primary mt-6 mb-3;
}

:deep(.prose p) {
  @apply text-gray-700 mb-4 leading-relaxed;
}

:deep(.prose ul) {
  @apply list-disc list-inside mb-4 space-y-2;
}

:deep(.prose li) {
  @apply text-gray-700;
}

:deep(.prose strong) {
  @apply font-semibold text-gray-900;
}

:deep(.prose a) {
  @apply text-primary hover:text-primary/80 underline;
}
</style>
