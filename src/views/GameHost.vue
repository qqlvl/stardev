<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import GameLayout from '@/layouts/GameLayout.vue'       // если alias '@' не работает, замени на '../layouts/GameLayout.vue'
import { gamesRegistry } from '../games'                 // относительный импорт надёжнее

const route = useRoute()
const id = String(route.params.id)

const Comp = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  const loader = gamesRegistry[id]
  if (!loader) {
    error.value = `Игра "${id}" не найдена`
    return
  }
  try {
    const mod = await loader()
    Comp.value = mod.default
  } catch (e: any) {
    error.value = e?.message ?? 'Не удалось загрузить игру'
  }
})
</script>

<template>
  <!-- Без меню: только заголовок и слот под игру -->
  <GameLayout :title="id">
    <div v-if="error" class="text-red-400">{{ error }}</div>
    <Suspense v-else>
      <component :is="Comp" />
      <template #fallback>
        <div class="opacity-70">Загрузка игры…</div>
      </template>
    </Suspense>
  </GameLayout>
</template>
