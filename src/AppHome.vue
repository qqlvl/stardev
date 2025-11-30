<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LiveTicker from './components/LiveTicker.vue'
import BalanceCard from './components/BalanceCard.vue'
import QuickActions from './components/QuickActions.vue'
import type { QAKey } from './types/quickActions'
import GamesGrid from './components/GamesGrid.vue'

import slotsPng from './assets/img/games/slots.png'
import soonPng from './assets/img/games/soon.png'

type Game = {
  id: string
  title: string
  thumbnail: string
  playUrl?: string
  isNew?: boolean
  isPopular?: boolean
}

const platform = ref('not-telegram')
const user = ref<{ first_name?: string; username?: string } | null>(null)
const qa = ref<QAKey>('games')
const router = useRouter()

/** ВАЖНО: id должны быть уникальны, иначе будут конфликты ключей в v-for */
const games = ref<Game[]>([
  { id: 'slots', title: 'Slots', thumbnail: slotsPng, isPopular: true, playUrl: '/play/slots' },
  { id: 'blackjack', title: 'Blackjack', thumbnail: soonPng, isNew: true, playUrl: '/play/blackjack' },
  { id: 'mines', title: 'Mines', thumbnail: soonPng, isNew: true, playUrl: '/play/mines' },
  { id: 'crash', title: 'Crash', thumbnail: soonPng, isNew: true, playUrl: '/play/crash' },
  { id: 'dice', title: 'Dice', thumbnail: soonPng, playUrl: '/play/dice' },
  { id: 'plinko', title: 'Plinko', thumbnail: soonPng, playUrl: '/play/plinko' },
  { id: 'keno', title: 'Keno', thumbnail: soonPng, playUrl: '/play/keno' },
])

function play(g: Game) {
  // пока без useRouter — просто навигируем:
  window.location.href = g.playUrl ?? `/play/${g.id}`
}

function onGames() {
  router.push({ name: 'home' })
}
function onDeposit() {
  router.push({ name: 'deposit' })
}
function onProfile() {
  router.push({ name: 'profile' })
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
    <LiveTicker />

    <main class="p-4 grid gap-4">

      <BalanceCard />

      <!-- СЕТКА ИГР -->
      <section>
        <GamesGrid :games="games" @play="play" />
      </section>
    </main>

    <QuickActions v-model="qa" fixed @games="onGames" @deposit="onDeposit" @profile="onProfile" />
  </div>
</template>
