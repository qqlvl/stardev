<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Item = { user: string; game: string; amount: string }
const items = ref<Item[]>([
  { user: 'alex***', game: 'Crash',   amount: '+$128.40' },
  { user: 'mira***', game: 'Dice',    amount: '+$42.00'  },
  { user: 'fox***',  game: 'Roulette',amount: '+$311.10' },
  { user: 'neo***',  game: 'Slots',   amount: '+$75.50'  },
])

// дублируем, чтобы лента была бесконечной
const loop = ref([...items.value, ...items.value, ...items.value])

onMounted(() => {
  // позже сюда можно прилепить вебсокет/поллинг
})
</script>

<template>
  <div class="sticky top-0 z-40" :style="{ paddingTop: 'var(--safe-top)' }">
    <div class="relative w-full overflow-hidden border-b border-white/10 bg-base-100/60 backdrop-blur">
      <!-- градиентные края -->
      <div class="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-base-100"></div>
      <div class="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-base-100"></div>

      <div class="ticker-row whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
        <span v-for="(it, idx) in loop" :key="idx"
              class="inline-flex items-center gap-2 text-sm text-base-content/80 px-3 py-2">
          <span class="i">🎉</span>
          <span class="font-semibold">{{ it.user }}</span>
          <span class="opacity-70">в</span>
          <span class="font-medium">{{ it.game }}</span>
          <span class="badge badge-success badge-sm font-semibold tracking-tight">{{ it.amount }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ticker-row {
  display: inline-block;
  animation: tickerMove 22s linear infinite;
  /* хитрость: контент в 2–3 раза длиннее ширины, чтобы бесшовно скроллилось */
}
</style>
