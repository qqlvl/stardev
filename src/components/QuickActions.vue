<template>
  <!-- wrapper: фиксированный низ (если fixed) или встроенный блок -->
  <div
    :class="[fixed ? 'fixed left-0 right-0 bottom-0 z-40' : 'relative', 'px-4']"
    style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px)"
  >
    <!-- баннер -->
    <div
      class="mx-auto max-w-screen-sm rounded-3xl overflow-hidden shadow-xl
             ring-1 ring-white/10
             bg-[radial-gradient(120%_120%_at_0%_100%,rgba(255,255,255,0.06),rgba(255,255,255,0)_60%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-md"
    >
      <!-- верхняя полоска-акцент -->
      <div class="h-1.5 bg-gradient-to-r from-indigo-400/80 via-fuchsia-400/80 to-amber-300/80"></div>

      <!-- контент баннера -->
      <div class="px-3 py-3 sm:px-4 sm:py-4">
        <!-- кнопки -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <!-- Бонус -->
          <button
            :class="btnClass('bonus')"
            @click="onPick('bonus'); emit('bonus')"
            aria-label="Ежедневный бонус"
          >
            <span class="icon-wrap">
              <svg viewBox="0 0 24 24" class="icon">
                <path fill="currentColor" d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v2a7 7 0 01-7 7h-4a7 7 0 01-7-7V11a3 3 0 013-3h1V7a5 5 0 015-5m-3 5a3 3 0 016 0v1H9z"/>
              </svg>
            </span>
            <span class="label">Бонус</span>
          </button>

          <!-- Рефералы -->
          <button
            :class="btnClass('referrals')"
            @click="onPick('referrals'); emit('referrals')"
            aria-label="Реферальная программа"
          >
            <span class="icon-wrap">
              <svg viewBox="0 0 24 24" class="icon">
                <path fill="currentColor" d="M12 12a5 5 0 10-5-5a5 5 0 005 5m-7 9a7 7 0 0114 0v1H5z"/>
              </svg>
            </span>
            <span class="label">Рефералы</span>
          </button>

          <!-- Чат -->
          <button
            :class="btnClass('chat')"
            @click="onPick('chat'); emit('chat')"
            aria-label="Открыть чат"
          >
            <span class="icon-wrap">
              <svg viewBox="0 0 24 24" class="icon">
                <path fill="currentColor" d="M12 3a9 9 0 019 9a9 9 0 01-9 9a8.9 8.9 0 01-3.9-.9L3 21l.9-5A9 9 0 0112 3z"/>
              </svg>
            </span>
            <span class="label">Чат</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type QAKey = 'bonus' | 'referrals' | 'chat'

const props = defineProps<{
  modelValue: QAKey | null
  fixed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: QAKey | null): void
  (e: 'bonus'): void
  (e: 'referrals'): void
  (e: 'chat'): void
}>()

function onPick(key: QAKey) {
  emit('update:modelValue', key)
  // авто-сброс подсветки
  setTimeout(() => emit('update:modelValue', null), 200)
}

function btnClass(key: QAKey) {
  const isActive = props.modelValue === key
  return [
    'btn-glass-outline',
    'group flex flex-col items-center justify-center gap-1 rounded-2xl py-3 sm:py-4',
    'ring-1 ring-white/10',
    'bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors',
    'text-sm font-semibold',
    isActive && 'btn-glass-outline outline outline-2 outline-offset-2 outline-white/25',
  ]
}
</script>

<style scoped>
.icon-wrap {
  @apply size-9 sm:size-10 rounded-xl grid place-items-center bg-white/10 ring-1 ring-white/15;
}
.icon {
  width: 18px;
  height: 18px;
  opacity: .9;
}
.label {
  @apply text-xs sm:text-sm;
}
</style>
