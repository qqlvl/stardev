<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSlotMachine } from './useSlotMachine'
import Slot from './ui/Slot.vue'
import type { SlotItem } from './constants'

const m = useSlotMachine()

// чистые значения для шаблона (без Ref)
const combo = computed<SlotItem[]>(() => m.combination.value)
const revealedSlots = computed<number>(() => m.revealedSlots.value)
const isGood = computed<boolean>(() => m.good.value)
const isSpinning = computed<boolean>(() => m.spinning.value)

// пока просто локальные значения — без бэка и без реальной логики
const fakeBalance = ref(123.45)
const bet = ref<number | null>(5) // стартуем с небольшой ставки

const maxBet = computed(() => fakeBalance.value)

function setBet(value: number) {
  const clamped = Math.max(0, Math.min(value, maxBet.value))
  bet.value = Number.isFinite(clamped) ? Number(clamped.toFixed(2)) : 0
}

function applyQuickBet(value: number) {
  setBet(value)
}

function betHalf() {
  setBet((bet.value ?? 0) / 2)
}

function betDouble() {
  setBet((bet.value ?? 0) * 2)
}

function betMax() {
  setBet(maxBet.value)
}

const canSpin = computed<boolean>(() => {
  const value = bet.value
  if (value === null || Number.isNaN(value)) return false
  if (value <= 0 || value > fakeBalance.value) return false
  return !isSpinning.value
})

async function handleSpin() {
  if (!canSpin.value) return
  await m.spin()
}
</script>

<template>
  <div class="slots-page">
    <section class="slots-card">
      <!-- Заголовок -->
      <header class="slots-header">
        <h1 class="slots-title text-iridescent">SLOTS</h1>
      </header>

      <!-- БАРАБАНЫ -->
      <div class="reels-wrap">
        <div class="reels">
          <Slot
            v-for="(item, i) in combo"
            :key="i"
            :index="i"
            :item="item"
            :revealed="revealedSlots > i"
            :good="isGood"
            :spinning="isSpinning"
          />
        </div>
      </div>

      <!-- БЛОК СТАВКИ -->
      <section class="bet-section">
        <div class="bet-card">
          <div class="bet-inner">
            <div class="bet-input-wrap">
              <span class="bet-currency">$</span>
              <input
                v-model.number="bet"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                name="bet"
                class="bet-input"
              />
            </div>
            <div class="bet-inline-actions">
              <div class="bet-modifiers-inline">
                <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betHalf">
                  1/2
                </button>
                <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betDouble">
                  2x
                </button>
                <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betMax">
                  MAX
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bet-actions">
          <div class="bet-chips">
            <button type="button" class="btn-glass-outline bet-chip" @click="applyQuickBet(5)">
              $5
            </button>
            <button type="button" class="btn-glass-outline bet-chip" @click="applyQuickBet(10)">
              $10
            </button>
            <button type="button" class="btn-glass-outline bet-chip" @click="applyQuickBet(20)">
              $20
            </button>
            <button type="button" class="btn-glass-outline bet-chip" @click="applyQuickBet(50)">
              $50
            </button>
          </div>
        </div>
      </section>

      <!-- КНОПКА SPIN -->
      <section class="spin-wrap">
        <button
          type="button"
          class="btn-glass-outline spin-btn"
          :disabled="!canSpin"
          @click="handleSpin"
        >
          <span class="spin-label">{{ isSpinning ? 'SPINNING...' : 'SPIN' }}</span>
          <span class="shimmer-layer spin-shimmer"></span>
        </button>

        <p class="hint-text">
          Сделайте ставку и нажмите SPIN
        </p>
      </section>
    </section>
  </div>
</template>

<style scoped>
/* Внешний контейнер страницы */
.slots-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 0;
}

/* Основная карта игры */
.slots-card {
  position: relative;
  border-radius: 28px;
  padding: 12px 16px 18px;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
}

/* Заголовок */
.slots-header {
  display: flex;
  justify-content: center;
  margin: 0 0 12px;
}

.slots-title {
  font-size: 18px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 900;
}

/* Барабаны */
.reels-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.reels {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 540px;
}

/* Блок ставки */
.bet-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bet-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.bet-label {
  color: rgba(255, 255, 255, 0.7);
}

.bet-amount {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.bet-card {
  border-radius: 20px;
  padding: 8px;
  background: rgba(8, 8, 17, 0.9);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 100%;
  max-width: 360px;
}

.bet-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}

.bet-input-wrap {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}

.bet-currency {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  color: #45d674;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.bet-inline-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.bet-modifiers-inline {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* инпут */
.bet-input {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  padding: 4px 0 4px 24px;
  width: 50px;
}

/* убираем стрелки у number */
.bet-input::-webkit-outer-spin-button,
.bet-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.bet-input[type='number'] {
  -moz-appearance: textfield;
}

/* кнопки быстрых ставок в стиле BalanceCard */
.bet-chip {
  min-width: 68px;
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.bet-chip-sm {
  min-width: 36px;
  height: 22px;
  padding: 0 5px;
  font-size: 9.5px;
}

.bet-chip:hover {
  transform: translateY(-1px);
}

.bet-chip:active {
  transform: translateY(0);
}

.bet-chip.is-ghost {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.14);
}

.bet-chips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.bet-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

/* Кнопка SPIN */
.spin-wrap {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spin-btn {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 14px 18px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
  transition:
    opacity 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.spin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin-btn:not(:disabled):active {
  transform: translateY(1px);
}

.spin-btn .spin-label {
  position: relative;
  z-index: 1;
}

.spin-shimmer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.spin-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.6);
}

/* подсказка */
.hint-text {
  font-size: 11px;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
}

/* адаптация под мобилку */
@media (max-width: 480px) {
  .slots-card {
    padding: 16px 12px 20px;
    border-radius: 24px;
  }

  .reels {
    gap: 8px;
  }

  .bet-inner {
    padding: 8px 10px;
  }

  .bet-chip {
    min-width: 56px;
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .reels {
    gap: 6px;
  }
}
</style>
