<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BalanceCard from './components/BalanceCard.vue'

const platform = ref('not-telegram')
const user = ref<{ first_name?: string; username?: string } | null>(null)

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'star-dark')
  const tg = (window as any).Telegram?.WebApp
  tg?.ready?.(); tg?.expand?.()
  platform.value = tg?.platform ?? 'not-telegram'
  user.value = tg?.initDataUnsafe?.user ?? null
})
</script>

<template>
  <div data-theme="star-dark" class="min-h-full bg-base-100 text-base-content pb-24">
    <div class="navbar bg-base-100/60 backdrop-blur border-b border-white/10 sticky top-0">
      <div class="flex-1 px-2">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white"
               style="background:linear-gradient(135deg,#7C5CFF,#3AC1FF)">★</div>
          <span class="font-bold tracking-wide text-white">STAR Casino</span>
        </div>
      </div>
      <div class="flex-none pr-2">
        <button class="btn btn-sm p-2 btn-primary">Профиль</button>
      </div>
    </div>

    <main class="p-4 grid gap-4">
      <section class="text-sm opacity-70">
        <p>Platform: <b>{{ platform }}</b></p>
        <p v-if="user">User: <b>{{ user.first_name }}</b> (@{{ user.username }})</p>
      </section>

      <BalanceCard />
    </main>
  </div>
</template>
