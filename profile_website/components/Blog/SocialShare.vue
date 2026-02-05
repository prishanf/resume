<template>
  <div 
    :class="[
      orientation === 'vertical' 
        ? 'flex flex-col items-center space-y-3' 
        : 'flex items-center space-x-4 py-6 border-t border-b border-gray-200 my-8'
    ]"
  >
    <span v-if="orientation !== 'vertical'" class="text-gray-700 font-medium">Share:</span>
    <a
      :href="twitterUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        orientation === 'vertical'
          ? 'p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          : 'flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
      ]"
      aria-label="Share on X (Twitter)"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span v-if="orientation !== 'vertical'" class="text-sm font-medium">X</span>
    </a>
    <a
      :href="linkedInUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        orientation === 'vertical'
          ? 'p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          : 'flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
      ]"
      aria-label="Share on LinkedIn"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span v-if="orientation !== 'vertical'" class="text-sm font-medium">LinkedIn</span>
    </a>
    <button
      @click="copyToClipboard"
      :class="[
        orientation === 'vertical'
          ? `p-2 rounded-lg transition-colors relative ${copied ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'}`
          : 'flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
      ]"
      :aria-label="orientation === 'vertical' ? (copied ? 'Copied!' : 'Copy link') : 'Copy link'"
    >
      <LinkIcon v-if="!copied || orientation !== 'vertical'" class="w-5 h-5" />
      <CheckIcon v-if="copied && orientation === 'vertical'" class="w-5 h-5 text-green-600" />
      <span v-if="orientation !== 'vertical'" class="text-sm font-medium">{{ copied ? 'Copied!' : 'Copy Link' }}</span>
    </button>
  </div>
</template>

<script setup>
import { LinkIcon, CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const route = useRoute()

const fullUrl = computed(() => {
  if (import.meta.client) {
    return window.location.origin + props.url
  }
  return props.url
})

const twitterUrl = computed(() => {
  const text = encodeURIComponent(props.title)
  const url = encodeURIComponent(fullUrl.value)
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
})

const linkedInUrl = computed(() => {
  const url = encodeURIComponent(fullUrl.value)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
})

const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
