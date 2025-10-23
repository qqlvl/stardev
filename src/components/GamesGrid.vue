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
import GameTile, { type Game } from './GameTile.vue'

const props = defineProps<{ games: Game[] }>()
const emit = defineEmits<{ (e:'play', game: Game): void }>()
function onPlay(g: Game) {
  // по умолчанию просто эмитим наверх;
  // на странице можно сделать router.push(g.playUrl ?? `/play/${g.id}`)
  emit('play', g)
}
</script>
