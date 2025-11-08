<script setup lang="ts">
// import { ref } from 'vue'

// const spinning = ref(false)
// const lastWin = ref(0)

// function onSpin() {
//   spinning.value = true
//   setTimeout(() => {
//     lastWin.value = 0 // пока пусто, просто 0
//     spinning.value = false
//   }, 600)
// }
</script>

<template>
  <section class="grid gap-4">
    <header class="flex items-center justify-between">
      <div class="text-3xl font-extrabold tracking-tight text-iridescent">Slots</div>
    
    </header>

    <div class="grid place-items-center h-48 rounded-xl ring-1 ring-white/10 bg-white/5">
      <span class="opacity-60">Поле слотов (скелет)</span>
    </div>

    <div class="flex gap-2">

    </div>
  </section>
</template>
