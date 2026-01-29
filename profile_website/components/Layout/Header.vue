<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary flex justify-center items-center size-12 bg-primary rounded-full text-white">PF</span> <span class="text-2xl font-bold text-primary flex items-center">Prishan Fernando</span>
        </NuxtLink>
        
        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navigation" :key="item.name">
            <NuxtLink
              v-if="!item.download"
              :to="item.href"
              class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              active-class="text-primary"
            >
              {{ item.name }}
            </NuxtLink>
            <a
              v-else
              :href="item.href"
              download
              class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium flex items-center"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-1.5" />
              {{ item.name }}
            </a>
          </template>
        </div>
        
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden pb-4 space-y-2"
      >
        <template v-for="item in navigation" :key="item.name">
          <NuxtLink
            v-if="!item.download"
            :to="item.href"
            class="block px-3 py-2 rounded-md text-gray-700 hover:bg-secondary transition-colors"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
          <a
            v-else
            :href="item.href"
            download
            class="block px-3 py-2 rounded-md text-gray-700 hover:bg-secondary transition-colors font-medium flex items-center"
            @click="mobileMenuOpen = false"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            {{ item.name }}
          </a>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { Bars3Icon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Posts', href: '/posts' },
  { name: 'Resume', href: '/resume.pdf', download: true }
]
</script>
