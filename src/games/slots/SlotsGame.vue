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
  <section class="slots-stage grid gap-4 pb-24 w-full max-w-[420px] mx-auto">
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
.slots-stage {
  /* базовые переменные размера под телефон */
  --stage-w: 100%;
  --gap: 12px;
  --radius: 18px;
  --card-w: clamp(90px, 26vw, 120px);

  width: 100%;
  margin-inline: auto;
  display: grid;
  row-gap: var(--gap);
}

/* заголовок / верхняя часть уже хорошо работает через tailwind в шаблоне */

/* ====== РЯД БАРАБАНОВ ====== */
.reels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap);
  justify-items: center;
  align-items: stretch;
  width: 100%;
}

/* Узкие телефоны: чуть уменьшаем ширину слотов */
@media (max-width: 360px) {
  .slots-stage {
    --card-w: 80px;
    --gap: 10px;
  }
}

/* Чуть больше воздуха на широких (но всё равно в пределах "телефона") */
@media (min-width: 480px) {
  .slots-stage {
    --gap: 14px;
  }
}

/* Безопасная зона iOS — можно оставить мягкой */
@supports(padding: max(0px)) {
  .slots-stage {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

/* Уважение к уменьшению анимаций */
@media (prefers-reduced-motion: reduce) {
  .reels {
    transition: none !important;
  }
}

/* Контролы под слотом */
.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
</style>

