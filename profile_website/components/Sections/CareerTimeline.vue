<template>
  <div class="relative py-24 overflow-hidden bg-white">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-20">
        <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">The Journey</h2>
        <h3 class="text-4xl md:text-5xl font-bold text-primary mb-6">
          Career Progression
        </h3>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A track record of continuous growth, increasing responsibility, and strategic impact across two decades.
        </p>
      </div>

      <!-- Vertical Timeline -->
      <div class="relative">
        <!-- Central Line -->
        <div class="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/5 -translate-x-1/2"></div>

        <div class="space-y-16">
          <div 
            v-for="(role, index) in processedRoles" 
            :key="index"
            class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between group"
            :class="{ 'lg:flex-row-reverse': index % 2 !== 0 }"
          >
            <!-- Timeline Node (Central Dot) -->
            <div class="absolute left-8 lg:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-white shadow-md z-10 transition-all duration-300 group-hover:scale-125"
              :class="[
                role.current ? 'bg-accent ring-4 ring-accent/20' : 
                role.isPromotion ? 'bg-primary ring-4 ring-primary/10' : 'bg-gray-300'
              ]"
            ></div>

            <!-- Promotion Label (On Line) -->
            <div v-if="role.isPromotion" 
                 class="absolute left-16 lg:left-1/2 lg:-translate-x-1/2 -top-8 lg:-top-6 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div class="bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-accent/20 flex items-center gap-1">
                 <ArrowUpIcon class="w-3 h-3" /> Promoted
               </div>
            </div>

            <!-- Date Label (Opposite Side) -->
            <div class="hidden lg:flex lg:w-1/2 items-center mb-2 lg:mb-0"
                 :class="[
                   index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'
                 ]">
              <span class="text-sm font-bold text-gray-400 font-mono tracking-wide py-1 px-3 rounded-full bg-gray-50 group-hover:bg-primary/5 group-hover:text-primary transition-colors whitespace-nowrap">
                {{ role.period }}
              </span>
            </div>

            <!-- Mobile Date Label -->
            <div class="pl-20 mb-2 lg:hidden">
              <span class="text-xs font-bold text-gray-400 font-mono">
                {{ role.period }}
              </span>
            </div>

            <!-- Content Card -->
            <div class="w-full lg:w-1/2 pl-20 lg:pl-0"
                 :class="[
                   index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'
                 ]">
              <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group-hover:border-primary/20">
                <!-- Hover Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div class="flex items-start justify-between">
                  <div>
                    <!-- Company & Level -->
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">
                        {{ role.company }}
                      </span>
                      <span v-if="role.careerLevel" 
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block"
                        :class="getLevelColor(role.careerLevel)">
                        {{ role.careerLevel }}
                      </span>
                    </div>

                    <!-- Role Title -->
                    <h4 class="text-lg font-bold text-primary mb-1 group-hover:text-primary transition-colors">
                      {{ role.role }}
                    </h4>
                    
                    <!-- Location & Duration -->
                    <div class="flex items-center text-xs text-gray-400 gap-2">
                       <MapPinIcon class="w-3 h-3" />
                       {{ role.location }}
                       <span v-if="role.duration" class="text-gray-300">•</span>
                       <span v-if="role.duration">{{ role.duration }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Node -->
        <div class="absolute left-8 lg:left-1/2 -translate-x-1/2 bottom-0 translate-y-full pt-8 flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-gray-300"></div>
          <span class="text-xs font-bold text-gray-300 uppercase tracking-widest mt-2">Career Start</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ArrowUpIcon,
  CalendarIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  timelineData: {
    type: Array,
    default: () => []
  }
})

// Sample Data for fallback
const getSampleTimelineData = () => [
  {
    company: 'Slalom',
    role: 'Director, Global Salesforce',
    location: 'Vancouver, BC',
    period: 'Jul 2021 – Present',
    current: true,
    duration: '3+ years',
    keyPoints: [
      'Grew Salesforce technical team to <strong>11+ members</strong>',
      'Built <strong>AI-assisted frameworks</strong> reducing effort by 70%'
    ],
    tags: ['Leadership', 'AI', 'Strategy'],
    careerLevel: 'Executive',
    careerLevelNumber: 6
  },
  {
    company: 'Slalom',
    role: 'Salesforce Practice Area Lead',
    location: 'Vancouver, BC',
    period: 'Sep 2019 – Aug 2021',
    current: false,
    duration: '2 years',
    keyPoints: [
      'Established delivery standards and technical excellence',
      'Implemented rigorous code review processes'
    ],
    tags: ['Leadership', 'Architecture'],
    careerLevel: 'Leadership',
    careerLevelNumber: 4
  },
  {
    company: 'Groundswell',
    role: 'Director of Development Services',
    location: 'Vancouver, BC',
    period: 'Jan 2019 – Aug 2021',
    current: false,
    duration: '2 years 8 mos',
    keyPoints: [
      'Led department of <strong>35+ team members</strong>',
      'Managed implementations with <strong>200K+ users</strong>'
    ],
    tags: ['Management', 'Scale'],
    careerLevel: 'Senior Management',
    careerLevelNumber: 5
  },
  {
    company: 'Groundswell',
    role: 'Development Manager',
    location: 'Vancouver, BC',
    period: 'Mar 2018 – Dec 2018',
    current: false,
    duration: '10 mos',
    keyPoints: [
      'Oversaw team of <strong>8+ developers</strong>',
      'Technical Architect for large-scale retail projects'
    ],
    tags: ['Management', 'Architecture'],
    careerLevel: 'Senior Management',
    careerLevelNumber: 5
  },
  {
    company: 'Groundswell',
    role: 'Team Lead Manager',
    location: 'Vancouver, BC',
    period: 'Oct 2017 – Mar 2018',
    current: false,
    duration: '6 mos',
    keyPoints: [
      'Implemented Separation of Concerns design patterns',
      'Integrated latest tech innovations into delivery'
    ],
    tags: ['Leadership', 'DevOps'],
    careerLevel: 'Leadership',
    careerLevelNumber: 4
  },
  {
    company: 'Groundswell',
    role: 'Technical Solutions Architect',
    location: 'Vancouver, BC',
    period: 'Jul 2016 – Feb 2017',
    current: false,
    duration: '8 mos',
    keyPoints: [
      'Led solution design and large data volume strategies',
      'Improved data quality and conversion strategies'
    ],
    tags: ['Architecture', 'Data'],
    careerLevel: 'Senior Professional',
    careerLevelNumber: 3
  },
  {
    company: 'TELUS',
    role: 'Sr. Developer Analyst',
    location: 'Burnaby, BC',
    period: 'Jan 2013 – Jul 2016',
    current: false,
    duration: '3 years 7 mos',
    keyPoints: [
      'Built Salesforce applications for SMB market',
      'Created reusable generic components for team efficiency'
    ],
    tags: ['Development', 'Integration'],
    careerLevel: 'Senior',
    careerLevelNumber: 2
  },
  {
    company: 'HSBC Software House',
    role: 'Consultant',
    location: 'Vancouver, BC',
    period: 'Jul 2010 – Dec 2012',
    current: false,
    duration: '2 years 6 mos',
    keyPoints: [
      'Lead designer for Trade & Supply Chain functions',
      'Specialized in multi-version enterprise J2EE development'
    ],
    tags: ['Java', 'Enterprise'],
    careerLevel: 'Senior Professional',
    careerLevelNumber: 3
  },
  {
    company: 'HSBC Canada',
    role: 'Senior Analyst',
    location: 'Vancouver, BC',
    period: 'Apr 2009 – Jul 2010',
    current: false,
    duration: '1 year 4 mos',
    keyPoints: [
      'Led design and delivery of Trade & Supply products',
      'Coordinated engineering teams across 6 countries'
    ],
    tags: ['Analysis', 'Coordination'],
    careerLevel: 'Senior',
    careerLevelNumber: 2
  },
  {
    company: 'HSBC',
    role: 'Analyst',
    location: 'Vancouver, BC',
    period: 'Jul 2006 – Apr 2009',
    current: false,
    duration: '2 years 10 mos',
    keyPoints: [
      'Developed global multi-country enterprise web apps',
      'Maintained Trade & Supply Chain systems'
    ],
    tags: ['Development'],
    careerLevel: 'Professional',
    careerLevelNumber: 1
  }
]

const processedRoles = computed(() => {
  const data = (props.timelineData && props.timelineData.length > 0) 
    ? props.timelineData 
    : getSampleTimelineData()

  return data.map((item, index) => {
    // Normalize company name (handle parsed vs sample data structure)
    const companyName = item.company || item.title
    
    // Check for promotion (compare with next item since array is newest-first)
    const nextItem = data[index + 1]
    let isPromo = false
    
    if (nextItem) {
      const nextCompanyName = nextItem.company || nextItem.title
      const currentLevel = item.careerLevelNumber || 0
      const nextLevel = nextItem.careerLevelNumber || 0
      
      // It's a promotion if same company AND higher level
      isPromo = (companyName === nextCompanyName) && (currentLevel > nextLevel)
    }

    return {
      ...item,
      company: companyName,
      isPromotion: isPromo || item.isPromotion
    }
  })
})

function getLevelColor(level) {
  switch(level) {
    case 'Executive': return 'bg-purple-100 text-purple-700'
    case 'Senior Management': return 'bg-indigo-100 text-indigo-700'
    case 'Leadership': return 'bg-blue-100 text-blue-700'
    case 'Senior Professional': return 'bg-emerald-100 text-emerald-700'
    case 'Senior': return 'bg-teal-100 text-teal-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>

<style scoped>
/* Custom Scrollbar for card content if needed */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>