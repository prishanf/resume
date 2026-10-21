<template>
  <img
    :src="attrs.src"
    :srcset="attrs.srcset"
    :sizes="attrs.sizes"
    :alt="alt || ''"
    :width="width"
    :height="height"
    loading="lazy"
    decoding="async"
  />
</template>

<script setup lang="ts">
import { responsiveImageAttrs } from '~/utils/responsiveImage'

const props = defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const attrs = computed(() => responsiveImageAttrs(props.src))
</script>
