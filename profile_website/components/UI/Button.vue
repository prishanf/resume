<template>
  <component
    :is="tag"
    :href="href"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  href: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

const tag = computed(() => props.href ? 'a' : 'button')

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-gray-800 hover:bg-secondary/80 focus:ring-secondary',
    accent: 'bg-accent text-gray-900 hover:bg-accent/90 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
