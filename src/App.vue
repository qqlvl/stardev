<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LiveTicker from './components/LiveTicker.vue'
import BalanceCard from './components/BalanceCard.vue'
import QuickActions, { type QAKey } from './components/QuickActions.vue'


const platform = ref('not-telegram')
const user = ref<{ first_name?: string; username?: string } | null>(null)


const qa = ref<QAKey | null>(null)

function onBonus() {
  // TODO: открыть модалку ежедневного бонуса
}
function onReferrals() {
  // TODO: открыть модалку/экран с реф-ссылкой
}
function onChat() {
  const tg = (window as any).Telegram?.WebApp
  const url = 'https://t.me/your_chat_here'
  tg?.openTelegramLink ? tg.openTelegramLink(url) : window.open(url, '_blank')
}

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
    <!-- лайв-лента -->
    <LiveTicker />

    <main class="p-4 grid gap-4">
      <section class="text-sm opacity-70">
        <p>Platform: <b>{{ platform }}</b></p>
        <p v-if="user">User: <b>{{ user.first_name }}</b> (@{{ user.username }})</p>
      </section>

      <!-- баннер с балансом -->
      <BalanceCard />

      
      <!-- дальше твоя сетка игр -->
      <!-- <GameGrid /> -->
    </main>

    <QuickActions v-model="qa" fixed @bonus="onBonus" @referrals="onReferrals" @chat="onChat" />


  </div>
</template>

<style>
body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>

