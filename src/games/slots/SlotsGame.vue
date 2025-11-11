<script setup lang="ts">
import { computed } from 'vue'
import { useSlotMachine } from './useSlotMachine'
import ItemPreview from './ui/ItemPreview.vue'
import Slot from './ui/Slot.vue'
import type { SlotItem } from './constants'

const m = useSlotMachine()

// чистые значения для шаблона (без Ref)
const combo = computed<SlotItem[]>(() => m.combination.value)
const revealedSlots = computed<number>(() => m.revealedSlots.value)
const isGood = computed<boolean>(() => m.good.value)
const isSpinning = computed<boolean>(() => m.spinning.value)
</script>

<template>
  <!-- добавлен класс slots-stage -->
  <section class="slots-stage grid gap-4 pb-28">
    <header class="flex items-center justify-between">
      <h2 class="font-semibold">Slots</h2>
      <div class="text-sm opacity-70" v-if="isGood">Win!</div>
    </header>

    <ItemPreview :betArray="m.betArray" />

    <!-- заменено: .slots -> .reels -->
    <div class="reels">
      <Slot
        v-for="(cell, i) in combo"
        :key="i"
        :index="i"
        :revealed="revealedSlots > i"
        :item="cell"
        :good="isGood"
        :spinning="isSpinning"
      />
    </div>

    <div class="controls">
      <input
        class="input input-sm w-24"
        type="number"
        min="1"
        :value="m.wager"
        @change="m.setWager(Number(($event.target as HTMLInputElement).value))"
      />
      <button class="btn btn-primary" :disabled="isSpinning" @click="m.spin">
        {{ isSpinning ? 'Spinning…' : 'Spin' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
/* ====== SLOTS SCENE (контейнер экрана) ====== */
.slots-stage{
  /* управляемая ширина блока — красиво от 320 до десктопа */
  --stage-w: clamp(300px, 92vw, 820px);
  --gap: clamp(8px, 2vw, 18px);
  --radius: clamp(10px, 16px, 20px);
  --card-w: clamp(86px, 22vw, 180px); /* ширина одной «карты» барабана */

  width: min(100%, var(--stage-w));
  margin-inline: auto;
  display: grid;
  row-gap: var(--gap);
  padding: clamp(8px, 2vw, 16px);
}

/* ====== REELS (грид из трёх барабанов) ====== */
.reels{
  display: grid;
  grid-template-columns: repeat(3, var(--card-w));
  justify-content: center;
  gap: var(--gap);
}

/* Узкие телефоны: уменьшаем карты, чтобы всё помещалось */
@media (max-width: 360px){
  .slots-stage{ --card-w: 30vw; }
}

/* Широкие: чуть больше «воздуха» */
@media (min-width: 900px){
  .slots-stage{ --gap: 20px; }
}

/* Безопасная зона iOS */
@supports(padding:max(0px)){
  .slots-stage{ padding-bottom: max(16px, env(safe-area-inset-bottom)); }
}

/* Уважение к уменьшению анимаций */
@media (prefers-reduced-motion: reduce){
  .reels { transition: none !important; }
}

/* существующее */
.controls { display:flex; gap:8px; justify-content:center; align-items:center; }
</style>
