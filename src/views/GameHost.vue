<script setup lang="ts">
import { onMounted, shallowRef, markRaw } from 'vue'  // ⬅️ вместо ref
import { useRoute } from 'vue-router'
import GameLayout from '@/layouts/GameLayout.vue'
import { gamesRegistry } from '../games'

const route = useRoute()
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
function onBonus() {}
function onReferrals() {}
function onChat() {}
</script>

<template>
  <GameLayout
    :title="id"
    :showTicker="true"
    :showQuickActions="true"
    @bonus="onBonus"
    @referrals="onReferrals"
    @chat="onChat"
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
