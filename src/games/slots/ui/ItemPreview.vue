<script setup lang="ts">
import { computed } from 'vue'
import type { Ref } from 'vue'
import { SLOT_ITEMS, type SlotItem } from '../constants'

defineProps<{ betArray: number[] | Ref<number[]> }>()

const itemsByMultiplier = computed(() => {
  const map = new Map<number, SlotItem[]>()
  for (const it of SLOT_ITEMS) {
    const arr = map.get(it.multiplier) ?? []
    arr.push(it)
    map.set(it.multiplier, arr)
  }
  return Array.from(map.entries())
    .map(([multiplier, items]) => ({ multiplier, items }))
    .sort((a,b)=>a.multiplier-b.multiplier)
})
</script>

<template>
  <div style="display:flex;justify-content:center">
    <!-- добавлен класс paytable -->
    <div class="preview paytable">
      <div
        v-for="({multiplier, items},i) in itemsByMultiplier"
        :key="i"
        :class="{ hidden: !(Array.isArray(betArray) ? betArray : betArray.value).includes(multiplier) }"
      >
        <div class="multiplier">{{ multiplier }}x</div>
        <div class="icon">
          <img v-if="items.length && items[0]" class="slotImage" :src="items[0]!.image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* контейнер превью — оставляем базовые отступы */
.preview {
  gap: 10px;
  align-items: center;
  padding: 6px 4px;
}

/* ====== PAYTABLE (горизонтальная лента превью/множителей) ====== */
.paytable{
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: end;
  gap: clamp(6px, 1.6vw, 12px);
  overflow-x: auto;                /* мягкий горизонтальный скролл на узких */
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;           /* Firefox */
}
.paytable::-webkit-scrollbar{ display:none; } /* WebKit */

/* чипы */
.preview > div {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9999px;
  padding: 6px 10px;
  white-space: nowrap;
}

/* адаптивная типографика/иконки */
.multiplier { 
  font-weight: 600; 
  font-size: clamp(10px, 2.4vw, 12px); 
  opacity: .9; 
}
.icon { 
  width: clamp(20px, 4.8vw, 24px); 
  height: clamp(20px, 4.8vw, 24px); 
  display:grid; 
  place-items:center; 
}
.slotImage { 
  width: clamp(18px, 4.4vw, 20px); 
  height: clamp(18px, 4.4vw, 20px); 
  object-fit: contain; 
}

.hidden { opacity: .35; filter: grayscale(1); }
</style>
