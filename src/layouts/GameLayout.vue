<script setup lang="ts">
import { useRouter } from 'vue-router'
import LiveTicker from '@/components/LiveTicker.vue'

const props = defineProps<{
  title?: string
  showMenu?: boolean
}>()

const router = useRouter()
function goBack() { router.push('/') }

const emit = defineEmits<{ (e:'open-menu'):void }>()
</script>

<template>
  <div class="min-h-full bg-base-100 text-base-content">
    <!-- header -->
    <header class="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-white/10">
      <div class="px-4 h-12 flex items-center gap-3">
        <button class="btn btn-xs" @click="goBack">←</button>
        <h1 class="font-semibold text-sm flex-1 truncate">{{ props.title ?? 'Game' }}</h1>
        <button v-if="props.showMenu" class="btn btn-xs" @click="emit('open-menu')">≡</button>
      </div>
      <!-- бегущая строка -->
      <LiveTicker />
    </header>

    <!-- game body -->
    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
