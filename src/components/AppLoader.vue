<script setup lang="ts">
import logoImg from '@/assets/img/logo.svg'

defineProps<{
  show: boolean
}>()
</script>

<template>
  <transition name="fade-scale" appear>
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-base-100/95 backdrop-blur flex items-center justify-center"
    >
      <div class="loader-card">
        <div class="glow" />

        <div class="logo-mark">
          <img :src="logoImg" alt="Star logo" class="logo-icon" />
          <span class="logo-text">tar</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.loader-card {
  position: relative;
  width: 220px;
  height: 220px;
  display: grid;
  place-items: center;
  border-radius: 32px;
  overflow: hidden;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
}

.glow {
  position: absolute;
  inset: 12%;
  border-radius: 28px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 60%);
  filter: blur(16px);
  opacity: 0.8;
}

.logo-mark {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.logo-icon {
  width: 74px;
  height: 74px;
  object-fit: contain;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.35));
}

.logo-text {
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 0.08em;
  background: linear-gradient(120deg, #ffffff 0%, #8ef1ff 25%, #d5b4ff 50%, #ffffff 75%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2.4s ease-in-out infinite;
  text-transform: uppercase;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
</style>
