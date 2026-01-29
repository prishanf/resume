<template>
  <a
    :href="resumeUrl"
    download
    :class="buttonClasses"
    @click="handleDownload"
  >
    <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
    <span>Download Resume</span>
  </a>
</template>

<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const resumeUrl = '/resume.pdf'

const buttonClasses = computed(() => {
  return 'inline-flex items-center px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
})

const handleDownload = () => {
  // Analytics or tracking could go here
}
</script>
