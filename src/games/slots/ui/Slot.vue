<script setup lang="ts">
import { computed } from 'vue'
import { SLOT_ITEMS, type SlotItem } from '../constants'

const props = defineProps<{
  revealed: boolean
  good: boolean
  index: number
  item?: SlotItem
  spinning: boolean
}>()

/**
 * Лента символов для спина.
 * При каждом новом спине (spinning: false → true) порядок меняется.
 */
const spinList = computed<SlotItem[]>(() => {
  // делаем зависимость от props.spinning, чтобы computed
  // пересчитывался на каждый новый спин
  props.spinning

  const result: SlotItem[] = []
  const loops = 3 // сколько "проходов" по символам

  for (let i = 0; i < loops; i++) {
    const shuffled = [...SLOT_ITEMS].sort(() => Math.random() - 0.5)
    result.push(...shuffled)
  }

  // дублируем, чтобы анимация на -50% была бесшовной
  return [...result, ...result]
})
</script>

<template>
  <div
    class="slot"
    :data-good="good"
    :data-revealed="revealed"
    :data-spinning="spinning"
  >
    <div class="card">
      <!-- Лента во время спина -->
      <div class="spinner" v-show="spinning && !revealed">
        <div class="tape" :data-spinning="spinning">
          <div v-for="(it, i) in spinList" :key="i" class="spin-cell">
            <img class="img" :src="it.image" />
          </div>
        </div>
      </div>

      <!-- Статическое состояние (до спина) -->
      <div class="idle" v-show="!spinning && !revealed">
        <div class="idle-cell top">
          <img class="img small" :src="item?.image" />
        </div>
        <div class="idle-cell mid">
          <img class="img" :src="item?.image" />
        </div>
        <div class="idle-cell bot">
          <img class="img small" :src="item?.image" />
        </div>
      </div>

      <!-- Итоговый символ -->
      <div
        v-if="item"
        class="revealed"
        :data-revealed="revealed"
        :data-good="revealed && good"
      >
        <img
          class="img"
          :src="item.image"
          :style="{ animationDelay: (index * 0.25) + 's' }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== БАРАБАН ===== */
.slot {
  flex: 1 1 0;
  max-width: 100px;
  aspect-ratio: 9 / 16;
  margin-inline: auto;

  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0, 0, 0, 0.35);
  overflow: hidden;
  box-shadow: inset 0 4px 18px rgba(0,0,0,.45);
  padding: 4px;
}

/* внутренняя карточка */
.card {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  /* background:
    radial-gradient(circle at 20% 0%, rgba(255,255,255,0.08), transparent),
    radial-gradient(circle at 80% 100%, rgba(0,255,140,0.14), transparent),
    #05070b; */
  box-shadow:
    inset 0 12px 24px rgba(255,255,255,0.06),
    inset 0 -18px 26px rgba(0,0,0,0.9);
  position: relative;
  overflow: hidden;
}

/* стартовый рывок при начале спина */
.slot[data-spinning="true"] .card {
  animation: slot-start 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* три слоя — спин, статика, результат */
.spinner,
.idle,
.revealed {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* спин и статика — три ячейки: верх / центр / низ */
.spinner,
.idle {
  justify-content: space-between;
}

/* итоговый символ — строго по центру */
.revealed {
  justify-content: center;
  opacity: 0;
  transform: translateY(4px) scale(0.9);
}

.revealed[data-revealed="true"] {
  animation: reveal 260ms ease-out forwards;
}

/* лента при спине */
.tape {
  display: flex;
  flex-direction: column;
  height: 300%;
  width: 100%;
  transform: translate3d(0, 0, 0);
}

/* ячейки ленты */
.spin-cell {
  flex: 0 0 28%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.idle-cell {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* верх/низ в статике — ближе к центру */
.idle-cell.top {
  opacity: 0.6;
  transform: translateY(10px) scale(0.9);
}

.idle-cell.bot {
  opacity: 0.6;
  transform: translateY(-10px) scale(0.9);
}

/* картинка символа */
.img {
  max-width: 72%;
  max-height: 72%;
  display: block;
}

/* победный слот — базовое свечение (можно будет усилить) */
.slot[data-good="true"] .card {
  box-shadow:
    0 0 24px rgba(0, 255, 140, 0.45),
    inset 0 12px 24px rgba(255,255,255,0.08),
    inset 0 -18px 26px rgba(0,0,0,0.9);
}

/* вспышка + лёгкий bounce карточки в момент, когда слот раскрывается */
.slot[data-revealed="true"] .card {
  animation: slot-reveal-card 220ms cubic-bezier(0.22, 0.75, 0.25, 1.05);
}

/* если слот ещё и выигрышный — добавим чуть больше света */
.slot[data-revealed="true"][data-good="true"] .card {
  animation: slot-reveal-card 220ms cubic-bezier(0.22, 0.75, 0.25, 1.05);
  box-shadow:
    0 0 32px rgba(0, 255, 140, 0.8),
    inset 0 14px 26px rgba(255,255,255,0.12),
    inset 0 -20px 30px rgba(0,0,0,1);
}

/* ===== АНИМАЦИИ ===== */
.tape[data-spinning="true"] {
  animation: spin 0.3s linear infinite;
  filter: blur(1px);
  opacity: 0.8;
  will-change: transform;
}

@keyframes spin {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, -50%, 0); }
}

@keyframes slot-reveal-card {
  0% {
    transform: translateY(10px) scale(0.92);
    box-shadow:
      0 0 0 rgba(0, 255, 140, 0),
      inset 0 10px 20px rgba(255,255,255,0.04),
      inset 0 -16px 22px rgba(0,0,0,0.9);
  }

  35% {
    transform: translateY(-4px) scale(1.10);
    box-shadow:
      0 0 40px rgba(0, 255, 140, 0.95),
      inset 0 18px 34px rgba(255,255,255,0.12),
      inset 0 -26px 34px rgba(0,0,0,1);
  }

  60% {
    transform: translateY(2px) scale(0.97);
    box-shadow:
      0 0 18px rgba(0, 255, 140, 0.45),
      inset 0 14px 26px rgba(255,255,255,0.08),
      inset 0 -20px 28px rgba(0,0,0,0.95);
  }

  100% {
    transform: translateY(0) scale(1);
    box-shadow:
      inset 0 12px 24px rgba(255,255,255,0.06),
      inset 0 -18px 26px rgba(0,0,0,0.9);
  }
}


/* появление итогового символа */
@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  55% {
    opacity: 1;
    transform: translateY(0) scale(1.06);
  }
  80% {
    opacity: 1;
    transform: translateY(-2px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* стартовый jerk + свет */
@keyframes slot-start {
  0% {
    transform: translateY(0) scale(1);
    box-shadow:
      0 0 0 rgba(0, 0, 0, 0),
      inset 0 12px 24px rgba(255,255,255,0.06),
      inset 0 -18px 26px rgba(0,0,0,0.9);
  }
  40% {
    transform: translateY(6px) scale(0.98);
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.5),
      inset 0 16px 28px rgba(255,255,255,0.10),
      inset 0 -22px 30px rgba(0,0,0,1);
  }
  100% {
    transform: translateY(0) scale(1);
    box-shadow:
      inset 0 12px 24px rgba(255,255,255,0.06),
      inset 0 -18px 26px rgba(0,0,0,0.9);
  }
}

/* очень узкие экраны — слоты поменьше */
@media (max-width: 360px) {
  .slot {
    max-width: 90px;
  }
}

/* respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .tape[data-spinning="true"] { animation: none !important; }
  .revealed { transition: none !important; }
  .revealed[data-revealed="true"] { animation: none !important; }
}
</style>
