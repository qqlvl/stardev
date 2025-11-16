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
function goBack() {
  // для мини-аппы этого обычно хватает
  router.back()
}
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-white/5"
    >
      <div class="mx-auto w-full max-w-[480px] px-3 py-2 flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition"
          @click="goBack"
        >
          ← Назад
        </button>
        <div class="flex-1" />
      </div>

      <LiveTicker v-if="showTicker" />
    </header>

    <!-- MAIN: сам контент игры -->
    <main class="flex-1 flex justify-center">
      <div class="w-full max-w-[480px] px-3 pt-3 pb-28">
        <!-- одна “карта” под игру -->
        <div
          class="rounded-3xl border border-white/5 bg-base-200/60
                 shadow-[0_18px_40px_rgba(0,0,0,0.55)]
                 p-4"
        >
          <slot />
        </div>
      </div>
    </main>

    <!-- НИЖНИЙ БЛОК -->
    <QuickActions
      v-if="showQuickActions"
      fixed
      @bonus="emit('bonus')"
      @referrals="emit('referrals')"
      @chat="emit('chat')"
    />
  </div>
</template>
