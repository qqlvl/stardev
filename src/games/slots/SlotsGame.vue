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

 <!-- Панель ставок -->
    <div class="bet-panel glass-card">
      <div class="bet-header">
        <span class="bet-title">Сумма ставки</span>
        <span class="bet-fiat">0,00 $</span>
      </div>

      <div class="bet-row">
        <div class="bet-main-input">
          <input
            class="input input-sm bet-input"
            type="number"
            min="1"
            :value="m.wager"
            @input="m.setWager(Number(($event.target as HTMLInputElement).value || 1))"
          />
          <span class="bet-token"> $</span>
        </div>
        <button
          class="bet-chip"
          type="button"
          @click="m.setWager(m.wager.value / 2)"
        >
          ½
        </button>

        <button
          class="bet-chip"
          type="button"
          @click="m.setWager(m.wager.value * 2)"
        >
          2×
        </button>
      </div>
    </div>

    <!-- Кнопка Spin отдельно ниже -->
    <button
      class="btn btn-primary btn-spin glass-card"
      :disabled="isSpinning"
      @click="m.spin"
      type="button"
    >
      {{ isSpinning ? '…' : 'SPIN' }}
    </button>
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

/* панель ставок под барабанами */
.bet-panel {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  display: grid;
  row-gap: 8px;
}

/* верхняя строка: текст + USD */
.bet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  opacity: 0.8;
}

.bet-title {
  font-weight: 500;
}

.bet-fiat {
  opacity: 0.65;
}

/* нижняя строка: инпут + быстрые кнопки */
.bet-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* контейнер основного инпута */
.bet-main-input {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255,255,255,0.06);
}

/* сам инпут ставки */
.bet-input {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  font-size: 13px;
}

/* "иконка" токена справа от инпута */
.bet-token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  min-height: 22px;
  border-radius: 999px;
  font-size: 12px;
  background: radial-gradient(circle at 30% 0%, #7cffb2, #00e092);
  color: #021013;
  font-weight: 600;
}

/* маленькие кнопки ½ и 2× */
.bet-chip {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
}

.bet-chip:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.18);
  transform: translateY(-1px);
}

/* большая кнопка Spin — на всю ширину, как основное действие */
.btn-spin {
  margin-top: 10px;
  width: 100%;
  justify-content: center;
}

/* немного плотнее всё на очень маленьких экранах */
@media (max-width: 360px) {
  .reels {
    gap: 6px;
  }
  .bet-panel {
    padding: 8px 10px;
    row-gap: 6px;
  }
  .bet-chip {
    min-width: 30px;
    height: 30px;
    font-size: 11px;
  }
}


@media (max-width: 360px) {
  .reels {
    gap: 6px;
  }
}
</style>

