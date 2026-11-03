<template>
  <td :data-label="label || undefined">
    <slot />
  </td>
</template>

<script setup>
const props = defineProps({
  dataLabel: { type: String, default: '' }
})

const attrs = useAttrs()
const label = computed(() =>
  props.dataLabel || attrs['data-label'] || attrs.dataLabel || ''
)
</script>
