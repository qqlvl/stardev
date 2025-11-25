<script setup lang="ts">
import { ref } from 'vue'
import AppLoader from './components/AppLoader.vue'

const isLoading = ref(false) // временно отключили лоадер
</script>

<template>
  <div
    data-theme="star-dark"
    class="min-h-dvh bg-base-100 text-base-content flex justify-center overflow-x-hidden"
  >
    <div class="w-full max-w-[480px]">
      <router-view />
    </div>
  </div>

  <AppLoader :show="isLoading" />
</template>
