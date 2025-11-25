<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LiveTicker from '@/components/LiveTicker.vue'
import QuickActions from '@/components/QuickActions.vue'
import type { QAKey } from '../types/quickActions'

type Quest = {
  id: string
  title: string
  reward: string
  done: boolean
}

const user = ref<{ first_name?: string; username?: string } | null>(null)
const balance = ref(114.05)
const level = ref(7)
const xp = ref(1350)
const nextLevelXp = ref(2000)
const qa = ref<QAKey>('profile')
const quests = ref<Quest[]>([
  { id: 'daily', title: 'Ежедневный бонус', reward: '+10 STAR', done: false },
  { id: 'matches', title: 'Сыграй 3 матча', reward: '+25 XP', done: true },
  { id: 'ref', title: 'Пригласи друга', reward: '+5% к кэшбеку', done: false },
])

const stats = ref({
  games: 124,
  winRate: 58,
  bestWin: 420.5,
  lastSeen: 'Сегодня, 12:40',
})

const referral = ref({
  code: 'STAR-9XQ2',
  friends: 12,
  earned: 142.3,
})

const router = useRouter()
function goHome() {
  router.push({ name: 'home' })
}
function goProfile() {
  router.push({ name: 'profile' })
}
function goDeposit() {
  router.push({ name: 'deposit' })
}

const initials = computed(() => {
  if (!user.value?.first_name) return 'S'
  return user.value.first_name.slice(0, 2).toUpperCase()
})

const xpProgress = computed(() => Math.min(100, Math.round((xp.value / nextLevelXp.value) * 100)))
const copyLabel = ref<'copy' | 'done'>('copy')

async function copyCode() {
  try {
    await navigator.clipboard.writeText(referral.value.code)
    copyLabel.value = 'done'
    setTimeout(() => (copyLabel.value = 'copy'), 1400)
  } catch (e) {
    copyLabel.value = 'copy'
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'star-dark')
  const tg = (window as any).Telegram?.WebApp
  tg?.ready?.()
  user.value = tg?.initDataUnsafe?.user ?? { first_name: 'Star User', username: 'star_player' }
})
</script>

<template>
  <div data-theme="star-dark" class="min-h-dvh bg-base-100 text-base-content">
    <header class="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-white/5">
      <LiveTicker />
    </header>

    <main class="mx-auto max-w-[540px] px-4 py-5 flex flex-col gap-4 pb-24">
      <!-- Профиль пользователя -->
      <section class="glass-card p-4 relative overflow-hidden">
        <div
          class="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
          style="
            background:
              radial-gradient(140px 140px at 80% 15%, #7C5CFF, transparent),
              radial-gradient(180px 180px at 10% 90%, #3AC1FF, transparent);
          "
        />
        <div class="relative z-10 flex items-center gap-3">
          <div
            class="size-14 rounded-2xl bg-gradient-to-br from-indigo-400/50 to-sky-400/40
                   flex items-center justify-center text-lg font-semibold ring-1 ring-white/15"
          >
            {{ initials }}
          </div>
          <div class="flex-1">
            <div class="text-base font-semibold">{{ user?.first_name ?? 'Star User' }}</div>
            <div class="text-sm text-white/70">@{{ user?.username ?? 'star_player' }}</div>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/5 text-xs border border-white/10">
            Уровень {{ level }}
          </div>
        </div>
      </section>

      <!-- Баланс и прогресс -->
      <section class="glass-card p-4 space-y-4 relative overflow-hidden">
        <div
          class="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
          style="
            background:
              radial-gradient(160px 160px at 15% 20%, #3AC1FF, transparent),
              radial-gradient(220px 220px at 85% 80%, #7C5CFF, transparent);
          "
        />
        <div class="relative z-10 flex items-center justify-between gap-3">
          <div>
            <div class="text-sm text-white/70">Баланс</div>
            <div class="text-3xl font-extrabold tracking-tight">${{ balance.toFixed(2) }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-glass-outline">История</button>
            <button class="btn btn-sm btn-glass-outline">Вывод</button>
          </div>
        </div>
        <div class="relative z-10 space-y-2">
          <div class="flex items-center justify-between text-sm text-white/70">
            <span>Прогресс уровня</span>
            <span>{{ xp }} / {{ nextLevelXp }} XP</span>
          </div>
          <div class="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300"
              :style="{ width: xpProgress + '%' }"
            />
          </div>
        </div>
      </section>

      <!-- Статистика -->
      <section class="glass-card p-4 relative overflow-hidden">
        <div class="relative z-10 space-y-3">
          <div class="text-base font-semibold">Статистика</div>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-xs text-white/70">Сыграно игр</div>
              <div class="text-xl font-semibold">{{ stats.games }}</div>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-xs text-white/70">Винрейт</div>
              <div class="text-xl font-semibold">{{ stats.winRate }}%</div>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-xs text-white/70">Лучший выигрыш</div>
              <div class="text-xl font-semibold">${{ stats.bestWin }}</div>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-xs text-white/70">Последний визит</div>
              <div class="text-xl font-semibold text-sm">{{ stats.lastSeen }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Квесты/бонусы -->
      <section class="glass-card p-4 space-y-3 relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-base font-semibold mb-2">Квесты</div>
          <div class="space-y-2">
            <div
              v-for="quest in quests"
              :key="quest.id"
              class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
            >
              <div
                class="size-9 rounded-lg grid place-items-center"
                :class="quest.done ? 'bg-emerald-400/20 text-emerald-200' : 'bg-indigo-400/15 text-indigo-100'"
              >
                <span v-if="quest.done">✓</span>
                <span v-else class="opacity-80">★</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">{{ quest.title }}</div>
                <div class="text-xs text-white/70">{{ quest.reward }}</div>
              </div>
              <button
                class="btn btn-xs rounded-lg"
                :class="quest.done ? 'btn-disabled opacity-60' : 'btn-glass-outline'"
              >
                {{ quest.done ? 'Готово' : 'Забрать' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Рефералы -->
      <section class="glass-card p-4 space-y-3 relative overflow-hidden">
        <div class="relative z-10 flex items-center gap-3">
          <div class="flex-1">
            <div class="text-base font-semibold">Рефералы</div>
            <div class="text-sm text-white/70">Делись ссылкой и получай бонусы</div>
          </div>
          <button class="btn btn-sm btn-glass-outline" @click="copyCode">
            <span v-if="copyLabel === 'copy'">Скопировать</span>
            <span v-else>Скопировано</span>
          </button>
        </div>
        <div class="relative z-10 p-3 rounded-xl bg-white/5 border border-white/10">
          <div class="text-xs text-white/70 mb-1">Твой код</div>
          <div class="text-lg font-semibold tracking-wide">{{ referral.code }}</div>
        </div>
        <div class="relative z-10 grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-xs text-white/70">Приглашено</div>
            <div class="text-xl font-semibold">{{ referral.friends }}</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-xs text-white/70">Заработано</div>
            <div class="text-xl font-semibold">${{ referral.earned }}</div>
          </div>
        </div>
      </section>
    </main>

    <QuickActions
      v-model="qa"
      fixed
      @games="goHome"
      @deposit="goDeposit"
      @profile="goProfile"
    />
  </div>
</template>
