<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="relative glass-card p-4 overflow-hidden">
    <div class="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
         style="background:
           radial-gradient(140px 140px at 80% 15%, #7C5CFF, transparent),
           radial-gradient(180px 180px at 10% 90%, #3AC1FF, transparent)">
    </div>

    <div class="flex items-center justify-between mb-1">
      <div class="text-5xl font-extrabold tracking-tight text-iridescent">STAR</div>
        <button class="btn btn-xs btn-ghost" @click="goProfile">
          <img src="/src/assets/img/user.svg" alt="user" class="w-7 h-7" />
        </button>
    </div>

    <div class="text-4xl font-extrabold tracking-tight">$114.05</div>

    <div class="mt-3 grid grid-cols-2 gap-2">

    <button class="btn-glass-outline">Играть</button>
  
    <button
      class="btn-glass-outline rounded-xl font-semibold relative overflow-hidden"
      v-motion
      :initial="{ scale: 1 }"
      :hovered="{ scale: 1.02 }"
      :pressed="{ scale: 0.98 }"
    >
      <span class="relative z-10">Депозит</span>
      <!-- отдельный слой для блика -->
      <span class="shimmer-layer absolute inset-0 pointer-events-none"></span>
    </button>

    </div>
  </div>
</template>
