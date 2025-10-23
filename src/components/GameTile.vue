<template>
  <article
    class="group grid gap-2 outline-none cursor-pointer"
    @click="$emit('play', game)"
  >
    <div class="relative rounded-2xl overflow-hidden bg-[#0f0f12] aspect-[16/9]">
      <img
        :src="game.thumbnail"
        :alt="`${game.title} — ${game.provider ?? ''}`"
        class="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />

      <div class="absolute top-2 left-2 flex gap-2">
        <span v-if="game.isNew" class="px-2 py-1 text-[10px] font-semibold rounded-full bg-white/10 backdrop-blur">
          NEW
        </span>
        <span v-if="game.isPopular" class="px-2 py-1 text-[10px] font-semibold rounded-full bg-white/10 backdrop-blur">
          HOT
        </span>
      </div>

      <!-- overlay -->
      <div
        class="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity
               bg-gradient-to-t from-black/60 via-black/10 to-transparent"
      >
        <button
          class="px-4 py-2 rounded-full font-bold bg-white text-black"
          @click.stop="$emit('play', game)"
        >
          Играть
        </button>
      </div>
    </div>

    <header class="grid">
      <h3 class="text-white text-sm font-bold truncate" :title="game.title">{{ game.title }}</h3>
      <div v-if="game.provider" class="text-xs text-white/60">{{ game.provider }}</div>
    </header>
  </article>
</template>

<script setup lang="ts">
export type Game = {
  id: string
  title: string
  thumbnail: string
  provider?: string
  playUrl?: string
  isNew?: boolean
  isPopular?: boolean
}

defineProps<{ game: Game }>()
defineEmits<{ (e:'play', game: Game): void }>()
</script>
