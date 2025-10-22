<script setup lang="ts">
const props = defineProps<{ title: string; subtitle?: string; gradient?: string; badge?: string }>()
</script>

<template>
  <button
    class="relative rounded-2xl p-4 text-left text-white ring-1 ring-white/10 hover:ring-accent/40 hover:shadow-2xl transition fade-in-up"
    :style="{ background: props.gradient || 'linear-gradient(135deg,#6E35FF,#FF8C53)' }">
    <div class="text-xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,.45)]">{{ title }}</div>
    <div class="text-sm opacity-90">{{ subtitle }}</div>
    <span v-if="badge" class="absolute right-3 top-3 badge badge-accent text-xs">{{ badge }}</span>
  </button>
</template>
