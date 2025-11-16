<script setup lang="ts">
import { computed } from 'vue'
import { SLOT_ITEMS, type SlotItem } from '../constants'

defineProps<{
  revealed: boolean
  good: boolean
  index: number
  item?: SlotItem
  spinning: boolean
}>()

/** базовый набор + его копия → бесшовная прокрутка на -50% */
const items = computed(() => [...SLOT_ITEMS].sort(() => Math.random() - 0.5))
const spinList = computed(() => [...items.value, ...items.value])  // ← используем в шаблоне
</script>

<template>
  <div class="slot" :data-good="good" :data-revealed="revealed">
    <!-- внутренняя карта для красивого «поля» и стабильных отступов -->
    <div class="card">
      <!-- Лента: видна только пока крутится и до показа результата -->
      <div class="spinner" v-show="spinning && !revealed">
        <div class="tape" data-spinning="true">
          <div v-for="(it,i) in spinList" :key="i" class="spin-cell">
            <img class="img" :src="it.image" />
          </div>
        </div>
      </div>

      <!-- Idle-трёхрядка: видно, когда не крутится и ещё не показан результат -->
      <div class="idle" v-show="!spinning && !revealed">
        <div class="idle-cell top"><img class="img small" :src="item?.image" /></div>
        <div class="idle-cell mid"><img class="img"       :src="item?.image" /></div>
        <div class="idle-cell bot"><img class="img small" :src="item?.image" /></div>
      </div>

      <!-- Итоговый символ: виден при revealed -->
      <div v-if="item" class="revealed" :data-revealed="revealed" :data-good="revealed && good">
        <img class="img" :src="item.image" :style="{ animationDelay: (index * .25) + 's' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== БАРАБАН ===== */
.slot {
  width: var(--card-w, 110px);       /* берём ширину из .slots-stage */
  aspect-ratio: 100 / 170;           /* примерно как 100x170px */
  position: relative;
  border-radius: var(--radius, 18px);
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0, 0, 0, 0.35);
  overflow: hidden;
  box-shadow: inset 0 4px 18px rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* внутренняя «карта» слота, чуть меньше самого контейнера */
.slot-inner {
  width: 88%;
  height: 92%;
  border-radius: calc(var(--radius, 18px) - 4px);
  background: radial-gradient(circle at 20% 0%, rgba(255,255,255,0.08), transparent),
              radial-gradient(circle at 80% 100%, rgba(0,255,140,0.14), transparent),
              #05070b;
  box-shadow:
    inset 0 12px 24px rgba(255,255,255,0.06),
    inset 0 -18px 26px rgba(0,0,0,0.9);
  overflow: hidden;
  position: relative;
}

/* лента с символами */
.tape {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  transform: translate3d(0, 0, 0);
}

.tape-item {
  flex: 1 0 33.3333%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
}

/* состояние, когда барабан крутится */
.tape[data-spinning="true"] {
  animation: spin 0.9s linear infinite;
}

/* итоговый символ (после остановки) */
.revealed {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px) scale(0.9);
}

.revealed[data-revealed="true"] {
  animation: reveal 260ms ease-out forwards;
}

/* победный слот — лёгкое свечение */
.slot[data-good="true"] .slot-inner {
  box-shadow:
    0 0 24px rgba(0, 255, 140, 0.45),
    inset 0 12px 24px rgba(255,255,255,0.08),
    inset 0 -18px 26px rgba(0,0,0,0.9);
}

/* ===== АНИМАЦИИ ===== */
@keyframes spin {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, -50%, 0); }
}

@keyframes reveal {
  0%   { opacity: 0; transform: translateY(6px) scale(0.9); }
  60%  { opacity: 1; transform: translateY(0) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* очень узкие экраны — немного ужимаем ширину барабана,
   высота сама подстроится из-за aspect-ratio */
@media (max-width: 360px) {
  .slot {
    width: 30vw;
  }
}

/* уважение к уменьшению анимаций */
@media (prefers-reduced-motion: reduce) {
  .tape[data-spinning="true"] { animation: none !important; }
  .revealed { transition: none !important; }
  .revealed[data-revealed="true"] { animation: none !important; }
}
</style>

