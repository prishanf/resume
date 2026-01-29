<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="(cert, index) in certifications"
      :key="index"
      class="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div class="flex items-start justify-between mb-6">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300"
          :class="getIconContainerClass(cert.issuer)"
        >
          <component :is="getIcon(cert.issuer)" class="w-6 h-6" />
        </div>
        <Badge v-if="cert.badge" variant="accent" size="sm" class="font-bold uppercase tracking-widest text-[10px]">{{ cert.badge }}</Badge>
      </div>

      <div class="flex-grow">
        <h3 class="text-xl font-bold text-primary mb-2 leading-tight group-hover:text-accent transition-colors duration-300">{{ cert.name }}</h3>
        <p v-if="cert.issuer" class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{{ cert.issuer }}</p>
      </div>

      <div class="pt-6 border-t border-gray-50 flex flex-col gap-1">
        <div v-if="cert.date" class="flex items-center text-xs text-gray-500">
          <CalendarIcon class="w-3.5 h-3.5 mr-2 opacity-70" />
          Issued {{ cert.date }}
        </div>
        <div v-if="cert.credentialId" class="flex items-center text-xs text-gray-400">
          <FingerPrintIcon class="w-3.5 h-3.5 mr-2 opacity-70" />
          ID: {{ cert.credentialId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  TrophyIcon, 
  AcademicCapIcon, 
  CommandLineIcon, 
  CpuChipIcon,
  CalendarIcon,
  FingerPrintIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CloudIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  certifications: {
    type: Array,
    required: true
  }
})

const getIcon = (issuer) => {
  const i = issuer?.toLowerCase() || ''
  if (i.includes('salesforce')) return CloudIcon
  if (i.includes('microsoft') || i.includes('github')) return CommandLineIcon
  if (i.includes('workato')) return CpuChipIcon
  if (i.includes('scrum')) return UserGroupIcon
  return TrophyIcon
}

const getIconContainerClass = (issuer) => {
  const i = issuer?.toLowerCase() || ''
  if (i.includes('salesforce')) return 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
  if (i.includes('microsoft') || i.includes('github')) return 'bg-gray-800/10 text-gray-800 group-hover:bg-gray-800 group-hover:text-white'
  if (i.includes('workato')) return 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary'
  if (i.includes('scrum')) return 'bg-secondary text-primary group-hover:bg-primary group-hover:text-white'
  return 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
}
</script>
