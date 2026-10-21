<template>
  <section class="mt-16 pt-12 border-t border-gray-100 space-y-10">
    <div class="rounded-2xl border border-primary/15 bg-white p-6 sm:p-8">
      <p class="text-lg text-gray-800 leading-relaxed">
        Have an Agentforce, integration or AI challenge?
        <a
          :href="LINKEDIN_PROFILE_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-primary-ink underline decoration-2 underline-offset-4 hover:underline"
        >Let's talk.</a>
      </p>
    </div>

    <div v-if="related.length">
      <h2 class="text-lg font-bold text-primary mb-4">Related posts</h2>
      <ul class="space-y-3">
        <li v-for="post in related" :key="post._path">
          <NuxtLink
            :to="post._path"
            class="font-semibold text-primary hover:underline"
          >
            {{ post.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LINKEDIN_PROFILE_URL } from '~/utils/seo'

defineProps<{
  related: Array<{ title: string; _path: string }>
}>()
</script>
