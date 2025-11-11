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
  <section class="grid gap-4 pb-28">
    <header class="flex items-center justify-between">
      <h2 class="font-semibold">Slots</h2>
      <div class="text-sm opacity-70" v-if="isGood">Win!</div>
    </header>

    <ItemPreview :betArray="m.betArray" />

    <div class="slots">
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
.slots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 0 auto;
  max-width: 360px;   /* чтобы 3 барабана не растягивались */
  min-height: 160px;  /* чтобы место под них было даже до первого спина */
}
.controls { display:flex; gap:8px; justify-content:center; align-items:center; }
</style>

