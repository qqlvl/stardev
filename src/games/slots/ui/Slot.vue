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
</template>


<style scoped>
/* размеры барабана/ячейки */
.slot {
  width: 100px;
  height: 180px;
  position: relative;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0,0,0,.25) inset;
}

/* ===== SPINNER: окно-маска + внутренняя лента ===== */

/* окно-маска */
.spinner{
  position: absolute; inset: 0;
  overflow: hidden;           /* важно: прячем ленту за краями */
  padding: 14px;
}

/* лента внутри окна — именно её двигаем */
@keyframes reel {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, -50%, 0); } /* -50%: список удвоен */
}
.tape{
  display: grid;
  grid-auto-rows: min-content;
  align-content: start;
  gap: 12px;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0,0,0);
}

/* быстрее и ровнее */
.tape[data-spinning="true"]{
  animation: reel .64s linear infinite;
}

/* лёгкий motion blur только во время спина */
.tape[data-spinning="true"] .img{
  filter: blur(1.4px) brightness(1.05) saturate(1.08);
}

/* ячейки и размер символов */
.spin-cell { width: 100%; height: 72px; display:grid; place-items:center; }
.img       { width: 70px; height: 70px; object-fit: contain; }
.img.small { width: 54px; height: 54px; opacity: .7; }

/* ===== IDLE: показываем ровно 3 символа ===== */
.idle {
  position: absolute; inset: 0;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;
  padding: 10px 0;
  pointer-events: none;
}
.idle-cell { display:grid; place-items:center; }
.idle .mid .img   { filter: none; }
.idle .top .img,
.idle .bot .img   { filter: saturate(.9) brightness(.95); }

/* ===== RESULT ===== */
@keyframes reveal {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes pulse {
  0%, 30% { transform: scale(1) }
  10%     { transform: scale(1.28) }
}
.revealed {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  padding: 14px;
  opacity: 0; transform: translateY(-100%);
  transition: opacity .22s ease, transform .28s ease;
}
.revealed[data-revealed="true"] {
  opacity: 1; transform: translateY(0);
  animation: reveal .25s cubic-bezier(0.18, 0.89, 0.32, 1.30);
}
.revealed[data-good="true"] .img {
  animation: pulse 2s .25s cubic-bezier(0.04, 1.14, 0.48, 1.63) infinite;
}

/* маски для глубины */
.slot::before,
.slot::after {
  content: ''; position: absolute; left:0; right:0; height: 22px; pointer-events:none;
}
.slot::before { top:0;    background: linear-gradient(to bottom, rgba(0,0,0,.35), transparent); }
.slot::after  { bottom:0; background: linear-gradient(to top,    rgba(0,0,0,.35), transparent); }
</style>