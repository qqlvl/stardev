<script setup lang="ts">
/**
 * Нижнее меню из трёх действий:
 *  - bonus      🎁
 *  - referrals  👥
 *  - chat       💬
 *
 * Пример: <QuickActions v-model="qa" @bonus="..." @referrals="..." @chat="..." />
 */

export type QAKey = 'bonus' | 'referrals' | 'chat'

const props = defineProps<{
  modelValue?: QAKey | null
  fixed?: boolean // если true — фиксируем внизу, иначе обычный блок
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: QAKey | null): void
  (e: 'bonus'): void
  (e: 'referrals'): void
  (e: 'chat'): void
}>()

function clickItem(k: QAKey) {
  emit('update:modelValue', k)
  const tg = (window as any).Telegram?.WebApp
  tg?.HapticFeedback?.impactOccurred?.('soft')

  if (k === 'bonus') emit('bonus')
  if (k === 'referrals') emit('referrals')
  if (k === 'chat') emit('chat')
}
</script>

<template>
  <div
    :class="[
      fixed ? 'fixed left-0 right-0 bottom-3 px-4 z-40' : '',
    ]"
    :style="fixed ? { paddingBottom: 'calc(8px + var(--safe-bottom))' } : undefined"
  >
    <div class="mx-auto max-w-md">
      <div class="qa-glass p-2">
        <button
          class="qa-btn"
          :class="{ 'qa-active': modelValue === 'bonus' }"
          @click="clickItem('bonus')"
        >
          <span class="text-lg">🎁</span>
          <span class="qa-label">Бонус</span>
        </button>

        <button
          class="qa-btn"
          :class="{ 'qa-active': modelValue === 'referrals' }"
          @click="clickItem('referrals')"
        >
          <span class="text-lg">👥</span>
          <span class="qa-label">Рефералы</span>
        </button>

        <button
          class="qa-btn"
          :class="{ 'qa-active': modelValue === 'chat' }"
          @click="clickItem('chat')"
        >
          <span class="text-lg">💬</span>
          <span class="qa-label">Чат</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-glass{
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.12);
  background: color-mix(in srgb, var(--color-base-100) 60%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: .5rem;
}
.qa-btn{
  height: 56px;
  border-radius: .9rem;
  display: flex;
  flex-direction: column;
  gap: .1rem;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--color-base-content) 100%, transparent);
  transition: background .12s ease, color .12s ease, box-shadow .12s ease;
}
.qa-btn:hover{ background: rgba(255,255,255,.06); }
.qa-active{
  color: var(--color-primary);
  box-shadow: inset 0 0 0 2px rgba(124,92,255,.35), 0 0 0 8px rgba(124,92,255,.10);
}
.qa-label{
  font-size: .72rem;
  font-weight: 600;
}
</style>
