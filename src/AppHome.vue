<script setup lang="ts"> import { onMounted, ref } from 'vue' 
import LiveTicker from './components/LiveTicker.vue' 
import BalanceCard from './components/BalanceCard.vue' 
import QuickActions, { type QAKey } from './components/QuickActions.vue'
import GamesGrid from './components/GamesGrid.vue'


import slotsPng   from './assets/img/games/slots.png'
import soonPng   from './assets/img/games/soon.png'

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
const qa = ref<QAKey | null>(null)

/** ВАЖНО: id должны быть уникальны, иначе будут конфликты ключей в v-for */
const games = ref<Game[]>([
  { id:'slots',  title:'',  thumbnail: slotsPng,  isPopular:true, playUrl:'/play/slots' },
  { id:'mines',  title:'',  thumbnail: soonPng, isNew:true,    playUrl:'/play/mines' },
  { id:'crash',  title:'',  thumbnail: soonPng, isNew:true,    playUrl:'/play/crash' },
  { id:'dice',   title:'',  thumbnail: soonPng,                playUrl:'/play/dice' },
  { id:'plinko', title:'',  thumbnail: soonPng,                playUrl:'/play/plinko' },
  { id:'keno',   title:'',  thumbnail: soonPng,                playUrl:'/play/keno' },
])

function play(g: Game) {
  // пока без useRouter — просто навигируем:
  window.location.href = g.playUrl ?? `/play/${g.id}`
}

function onBonus() { /* TODO */ }
function onReferrals() { /* TODO */ }
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
    <LiveTicker />

    <main class="p-4 grid gap-4">

      <BalanceCard />

      <!-- СЕТКА ИГР -->
      <section>
        <GamesGrid :games="games" @play="play" />
      </section>
    </main>

    <QuickActions v-model="qa" fixed @bonus="onBonus" @referrals="onReferrals" @chat="onChat" />
  </div>
</template>
