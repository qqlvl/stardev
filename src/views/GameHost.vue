<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gamesRegistry } from '../games'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

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

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-full p-4">
    <button class="btn btn-sm mb-3" @click="goBack">← Назад</button>

    <div v-if="error" class="text-red-400">{{ error }}</div>
    <Suspense v-else>
      <component :is="Comp" />
      <template #fallback>
        <div class="opacity-70">Загрузка игры…</div>
      </template>
    </Suspense>
  </div>
</template>
