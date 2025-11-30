<script setup lang="ts">
import LiveTicker from '@/components/LiveTicker.vue'
import QuickActions from '@/components/QuickActions.vue'

const { showTicker = true, showQuickActions = true } = defineProps<{
  showTicker?: boolean
  showQuickActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'games'): void
  (e: 'deposit'): void
  (e: 'profile'): void
}>()
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-white/5"
    >
      <LiveTicker v-if="showTicker" />
    </header>

    <!-- MAIN: сам контент игры -->
    <main class="flex-1 flex justify-center">
      <div class="w-full max-w-[480px] px-3 pt-3 pb-28">
       <!-- одна “карта” под игру -->
        <div class="relative rounded-3xl p-4 glass-card overflow-hidden">

          <!-- Градиентный задний фон -->
          <div
            class="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
            style="
              background:
                radial-gradient(140px 140px at 80% 15%, #7C5CFF, transparent),
                radial-gradient(180px 180px at 10% 90%, #3AC1FF, transparent);
            "
          ></div>

          <!-- Контент -->
          <div class="relative z-10">
            <slot />
          </div>

        </div>

      </div>
    </main>

    <!-- НИЖНИЙ БЛОК -->
    <QuickActions
      v-if="showQuickActions"
      fixed
      @games="emit('games')"
      @deposit="emit('deposit')"
      @profile="emit('profile')"
    />
  </div>
</template>
