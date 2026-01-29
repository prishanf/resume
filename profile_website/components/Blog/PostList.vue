<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <PostCard
      v-for="post in posts"
      :key="post._id"
      :post="post"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Array,
    required: true
  }
})
</script>
