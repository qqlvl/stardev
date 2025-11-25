<script setup lang="ts">
import { onMounted, shallowRef, markRaw } from 'vue'  // ⬅️ вместо ref
import { useRoute, useRouter } from 'vue-router'
import GameLayout from '@/layouts/GameLayout.vue'
import { gamesRegistry } from '../games'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)

const Comp = shallowRef<any>(null)   // ⬅️ shallowRef
const error = shallowRef<string | null>(null)

onMounted(async () => {
  const loader = gamesRegistry[id]
  if (!loader) { error.value = `Игра "${id}" не найдена`; return }
  try {
    const mod = await loader()
    Comp.value = markRaw(mod.default)  // ⬅️ markRaw, чтобы не реактивить компонент
  } catch (e: any) {
    error.value = e?.message ?? 'Не удалось загрузить игру'
  }
})

// заглушки под действия QuickActions
function onGames() {
  router.push({ name: 'home' })
}
function onDeposit() {
  router.push({ name: 'deposit' })
}
function onProfile() {
  router.push({ name: 'profile' })
}
</script>

<template>
  <GameLayout
    :title="id"
    :showTicker="true"
    :showQuickActions="true"
    @games="onGames"
    @deposit="onDeposit"
    @profile="onProfile"
  >
    <div v-if="error" class="text-red-400">{{ error }}</div>

    <Suspense v-else>
      <component :is="Comp" />
      <template #fallback>
        <div class="opacity-70">Загрузка игры…</div>
      </template>
    </Suspense>
  </GameLayout>
</template>
