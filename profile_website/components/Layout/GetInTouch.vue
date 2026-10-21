<template>
  <section v-if="variant === 'page'" class="py-20 bg-inverse">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <h2 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-4">Get in touch</h2>
        <h3 class="text-3xl md:text-4xl font-black text-primary mb-6 tracking-tight">
          Let's talk.
        </h3>
        <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
          Open to conversations about AI leadership, Salesforce architecture, and collaboration.
          The best way to reach Prishan is on LinkedIn.
        </p>
        <a
          :href="linkedinUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        >
          Connect on LinkedIn
          <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  </section>

  <div v-else>
    <h4 class="text-white font-semibold mb-4">Get in touch</h4>
    <p class="text-sm mb-4">
      For AI leadership, Salesforce architecture, or collaboration, connect on LinkedIn.
    </p>
    <a
      :href="linkedinUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center text-sm font-semibold text-accent hover:text-white transition-colors"
    >
      Message on LinkedIn
      <span aria-hidden="true" class="ml-1">→</span>
    </a>
  </div>
</template>

<script setup>
import { LINKEDIN_PROFILE_URL } from '~/utils/seo'

defineProps({
  variant: {
    type: String,
    default: 'footer',
    validator: (value) => ['footer', 'page'].includes(value)
  }
})

const linkedinUrl = LINKEDIN_PROFILE_URL
</script>
