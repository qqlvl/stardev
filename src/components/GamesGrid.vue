<template>
  <section class="grid gap-4">
    <div
      class="grid gap-3
             grid-cols-2
             sm:grid-cols-3
             md:grid-cols-4
             xl:grid-cols-5"
    >
      <GameTile
        v-for="g in games"
        :key="g.id"
        :game="g"
        @play="onPlay"
      />
    </div>

    <p v-if="games.length === 0" class="text-center text-white/60 py-6">
      Пока нет игр
    </p>
  </section>
</template>

<script setup lang="ts">
import GameTile from './GameTile.vue'  // <<< ВАЖНО: добавить импорт
/** Согласован с AppHome.vue: обязательные title и thumbnail */
type GridGame = {
  id: string
  title: string
  thumbnail: string
  playUrl?: string
  isNew?: boolean
  isPopular?: boolean
}

/** пропс games */
const { games } = defineProps<{ games: GridGame[] }>()

/** событие play(game) */
const emit = defineEmits<{
  (e: 'play', game: GridGame): void
}>()

function onPlay(game: GridGame) {
  emit('play', game)
}
</script>


