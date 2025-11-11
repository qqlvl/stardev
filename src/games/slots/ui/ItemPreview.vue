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
    <div class="preview">
      <div v-for="({multiplier, items},i) in itemsByMultiplier" :key="i" :class="{ hidden: !(Array.isArray(betArray) ? betArray : betArray.value).includes(multiplier) }">
        <div class="multiplier">{{ multiplier }}x</div>
        <div class="icon">
          <img v-if="items.length && items[0]" class="slotImage" :src="items[0]!.image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  gap: 10px;
  align-items: center;
  overflow-x: auto;
  padding: 6px 4px;
  scrollbar-width: none;
}
.preview::-webkit-scrollbar { display: none; }

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

.multiplier { font-weight: 600; font-size: 12px; opacity: .9; }
.icon { width: 24px; height: 24px; display:grid; place-items:center; }
.slotImage { width: 20px; height: 20px; object-fit: contain; }

.hidden { opacity: .35; filter: grayscale(1); }
</style>
