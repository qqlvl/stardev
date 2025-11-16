<script setup lang="ts">
import { computed } from 'vue'
import { useSlotMachine } from './useSlotMachine'
// import ItemPreview from './ui/ItemPreview.vue'
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
  <section class="slots-stage grid gap-4 pb-24 w-full max-w-[420px] mx-auto">
    <header class="flex items-center justify-between">
      <h2 class="font-semibold">Slots</h2>
      <div class="text-sm opacity-70" v-if="isGood">Win!</div>
    </header>

    <!-- <ItemPreview :betArray="m.betArray" /> -->

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
/* Вся сцена слотов */
.slots-stage {
  width: 100%;
  max-width: 420px;        /* внутри "телефона" */
  margin: 0 auto;
  display: grid;
  row-gap: 16px;
}

/* Ряд барабанов — 3 слота, равномерно по ширине */
.reels {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
}

/* контролы под слотом */
.controls {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

@media (max-width: 360px) {
  .reels {
    gap: 6px;
  }
}
</style>

