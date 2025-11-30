<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { QAKey } from '../types/quickActions'
export type { QAKey } from '../types/quickActions'

const props = withDefaults(defineProps<{
  modelValue?: QAKey | null
  fixed?: boolean
}>(), {
  modelValue: null,
  fixed: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: QAKey | null): void
  (e: 'games'): void
  (e: 'deposit'): void
  (e: 'profile'): void
}>()

type IconName = 'home' | 'wallet' | 'user'

const items: Array<{ key: QAKey; label: string; icon: IconName }> = [
  { key: 'games', label: 'Игры', icon: 'home' },
  { key: 'deposit', label: 'Депозит', icon: 'wallet' },
  { key: 'profile', label: 'Профиль', icon: 'user' },
]

const innerActive = ref<QAKey>('games')
const viewportOffset = ref(0)

function bindViewport() {
  const vv = window.visualViewport
  if (!vv) return
  const update = () => {
    // если клавиатура сжимает viewport — фиксируем нижний зазор, иначе 0
    const delta = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
    viewportOffset.value = delta
  }
  vv.addEventListener('resize', update, { passive: true })
  vv.addEventListener('scroll', update, { passive: true })
  update()
  return () => {
    vv.removeEventListener('resize', update)
    vv.removeEventListener('scroll', update)
  }
}

onMounted(() => {
  cleanup.value = bindViewport() || null
})

const cleanup = ref<(() => void) | null>(null)
onUnmounted(() => {
  cleanup.value?.()
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) innerActive.value = val
  },
  { immediate: true },
)

const activeKey = computed<QAKey>(() => props.modelValue ?? innerActive.value)

function onPick(key: QAKey) {
  innerActive.value = key
  emit('update:modelValue', key)
  if (key === 'games') emit('games')
  else if (key === 'deposit') emit('deposit')
  else emit('profile')
}

function iconPath(name: IconName) {
  switch (name) {
    case 'home':
      return 'M4 11.5 12 5l8 6.5V19H4z M10 19v-4.5a2 2 0 1 1 4 0V19'
    case 'wallet':
      return 'M5 7a2 2 0 012-2h12v4h-3.5a2.5 2.5 0 000 5H19v4H7a2 2 0 01-2-2z M14.5 13.5h3'
    case 'user':
      return 'M12 12a4 4 0 100-8 4 4 0 000 8zm-6 6a6 6 0 1112 0v1H6z'
  }
}
</script>

<template>
  <div
    :class="[fixed ? 'fixed left-0 right-0 bottom-0 z-40' : 'relative', 'px-4 flex justify-center']"
    style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px)"
    :style="{ paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 12px + ${viewportOffset}px)` }"
  >
    <div class="nav-shell">
      <div class="nav-blur" />
      <div class="nav-inner">
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          :class="['nav-btn', activeKey === item.key && 'is-active']"
          @click="onPick(item.key)"
          :aria-label="item.label"
        >
          <span class="icon-wrap" :data-key="item.key">
            <svg viewBox="0 0 24 24" class="icon">
              <path :d="iconPath(item.icon)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-shell {
  position: relative;
  margin: 0 auto;
  max-width: 460px;
  padding: 10px 12px;
  border-radius: 26px;
  overflow: visible;
  display: flex;
  justify-content: center;
  transform: translateY(-12px); /* приподнимаем панель от нижнего края */
}

.nav-blur {
  position: absolute;
  inset: 0;
  border-radius: 26px;
  background: linear-gradient(120deg, rgba(124, 92, 255, 0.18), rgba(58, 193, 255, 0.12));
  filter: blur(16px);
  opacity: 0.85;
  pointer-events: none;
}

.nav-inner {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 70px);
  align-items: center;
  justify-content: center;
  justify-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 22px;
  background: rgba(20, 22, 32, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  transition:
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
  min-height: 60px;
}

.nav-btn {
  position: relative;
  width: 70px;
  height: 56px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.72);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  text-align: center;
  transition:
    transform 120ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease,
    filter 180ms ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.nav-btn[data-key="deposit"] {
  box-shadow:
    0 12px 28px rgba(90, 200, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.nav-btn[data-key="deposit"].is-active {
  box-shadow:
    0 14px 34px rgba(90, 200, 255, 0.35),
    inset 0 0 12px rgba(255, 255, 255, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.25);
}

.nav-btn:not(.is-active) .icon {
  opacity: 0.65;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.nav-btn:active {
  transform: scale(0.96);
}

.nav-btn.is-active {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
  color: #ffffff;
  box-shadow:
    inset 0 0 12px rgba(255, 255, 255, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 10px 30px rgba(90, 200, 255, 0.2);
}

.nav-btn.is-active::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0));
  opacity: 0.55;
  pointer-events: none;
}

.icon-wrap {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: transform 160ms ease, filter 160ms ease;
}

.icon {
  width: 34px;
  height: 34px;
}

@media (max-width: 420px) {
  .nav-btn {
    height: 52px;
  }
}
</style>
