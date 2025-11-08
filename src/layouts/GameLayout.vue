<script setup lang="ts">
import { useRouter } from 'vue-router'
import LiveTicker from '@/components/LiveTicker.vue'
import QuickActions from '@/components/QuickActions.vue'

const { showTicker = true, showQuickActions = true } = defineProps<{
  showTicker?: boolean
  showQuickActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'bonus'): void
  (e: 'referrals'): void
  (e: 'chat'): void
}>()

const router = useRouter()
function goBack() { router.push('/') }
</script>

<template>
  <div class="min-h-dvh bg-base-100 text-base-content pb-24">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 backdrop-blur-md bg-base-100/80 border-b border-white/10"
    >
      <div class="mx-auto max-w-screen-sm px-4 h-12 flex items-center gap-3">
        <button class="" @click="goBack">←</button>

        <h1 class="font-semibold text-sm flex-1 truncate">
          Назад
        </h1>

        <!-- правый слот: можно передать что-то вроде мини-баланса -->
        <slot name="right" />
      </div>

      <LiveTicker v-if="showTicker" />
    </header>

    <!-- Body -->
    <main class="mx-auto max-w-screen-sm p-4">
      <div
        class="rounded-3xl ring-1 ring-white/10 bg-white/5 shadow-xl
               bg-[radial-gradient(120%_120%_at_0%_100%,rgba(255,255,255,.06),rgba(255,255,255,0)_60%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))]">
        <div class="p-4 sm:p-6">
          <slot />
        </div>
      </div>
    </main>

    <!-- Универсальное меню (фиксируется снизу) -->
    <QuickActions
      v-if="showQuickActions"
      fixed
      @bonus="emit('bonus')"
      @referrals="emit('referrals')"
      @chat="emit('chat')"
    />
  </div>
</template>
