<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LiveTicker from '@/components/LiveTicker.vue'
import QuickActions from '@/components/QuickActions.vue'
import type { QAKey } from '../types/quickActions'

const router = useRouter()

const qa = ref<QAKey>('deposit')
const currencies = ['USDT', 'TON', 'BTC', 'ETH'] as const
type Currency = (typeof currencies)[number]
const presets = [10, 25, 50, 100]

const depositCurrency = ref<Currency>(currencies[0])
const depositAmount = ref<string>('50.00')
const depositNote = ref<string>('После оплаты проверь статус — зачисление может занять до 1-2 минут.')

const withdrawCurrency = ref<Currency>(currencies[0])
const withdrawAmount = ref<string>('25.00')
const withdrawAddress = ref<string>('')
const withdrawNote = ref<string>('Вывод подтверждается вручную. Срок зависит от загруженности сети.')

function goHome() {
  router.push({ name: 'home' })
}

function goProfile() {
  router.push({ name: 'profile' })
}

function goDeposit() {
  router.push({ name: 'deposit' })
}

function setPreset(val: number) {
  depositAmount.value = formatAmount(val)
}

function formatAmount(val: string | number) {
  const num = Number(val)
  if (Number.isNaN(num)) return ''
  return num.toFixed(2)
}

function onInputAmount(target: 'deposit' | 'withdraw', e: Event) {
  const input = e.target as HTMLInputElement
  const cleaned = input.value.replace(/[^0-9.]/g, '')
  const parts = cleaned.split('.')
  const normalized =
    parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}` : parts[0]
  const formatted = normalized ? formatAmount(normalized) : ''
  if (target === 'deposit') depositAmount.value = formatted
  else withdrawAmount.value = formatted
}

function handlePay() {
  // Здесь будет запрос к вашему бэкенду для создания инвойса CryptoBot и открытия pay_url
  alert(`Создаём инвойс на ${depositAmount.value} ${depositCurrency.value} через CryptoBot`)
}

function handleWithdraw() {
  // Здесь будет вызов бэкенда на заявку вывода
  alert(`Заявка на вывод ${withdrawAmount.value} ${withdrawCurrency.value} на адрес ${withdrawAddress.value || '—'}`)
}
</script>

<template>
  <div data-theme="star-dark" class="min-h-dvh bg-base-100 text-base-content">
    <header class="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-white/5">
      <LiveTicker />
    </header>

    <main class="mx-auto max-w-[540px] px-4 py-5 flex flex-col gap-4 pb-24">
      <section class="glass-card p-5 space-y-3 relative overflow-hidden deposit-card">
        <div
          class="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
          style="
            background:
              radial-gradient(170px 170px at 15% 20%, rgba(92, 255, 196, 0.3), transparent),
              radial-gradient(240px 240px at 85% 80%, rgba(124, 92, 255, 0.4), transparent);
          "
        />
        <div class="relative z-10 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm text-white/70">Внести через CryptoBot</div>
              <div class="text-xl font-semibold">Крипто депозит</div>
            </div>
            <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10 text-xs">
              <span class="opacity-70">Валюта</span>
              <select v-model="depositCurrency" class="bg-transparent outline-none">
                <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-3 compact-row">
            <div class="flex-1">
              <div class="text-xs text-white/70 mb-1">Сумма</div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <span class="text-sm font-semibold opacity-80">{{ depositCurrency }}</span>
                <input
                  v-model="depositAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="flex-1 bg-transparent outline-none text-lg font-semibold"
                  inputmode="decimal"
                  @input="onInputAmount('deposit', $event)"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2 preset-grid">
            <button
              v-for="p in presets"
              :key="p"
              class="btn btn-sm btn-glass-outline rounded-xl"
              @click="setPreset(p)"
            >
              {{ p }}
            </button>
          </div>

          <button type="button" class="btn btn-glass-outline w-full rounded-xl py-3 pay-btn" @click="handlePay">
            <span class="pay-label">Оплатить в CryptoBot</span>
          </button>

          <div class="text-[11px] text-white/60 leading-snug flex items-start gap-1.5">
            <span class="opacity-70">⏳</span>
            <span>{{ depositNote }}</span>
          </div>
        </div>
      </section>

      <section class="glass-card p-4 space-y-3 relative overflow-hidden withdraw-card">
        <div
          class="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
          style="
            background:
              radial-gradient(150px 150px at 80% 15%, rgba(124, 92, 255, 0.25), transparent),
              radial-gradient(200px 200px at 10% 90%, rgba(58, 193, 255, 0.18), transparent);
          "
        />
        <div class="relative z-10 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm text-white/70">Запросить</div>
              <div class="text-xl font-semibold">Вывод средств</div>
            </div>
            <div class="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10 text-xs">
              <span class="opacity-70">Валюта</span>
              <select v-model="withdrawCurrency" class="bg-transparent outline-none">
                <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <div class="space-y-1">
              <div class="text-xs text-white/70">Сумма ({{ withdrawCurrency }})</div>
              <input
                v-model="withdrawAmount"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-lg font-semibold outline-none"
                inputmode="decimal"
                @input="onInputAmount('withdraw', $event)"
                placeholder="0.00"
              />
            </div>
            <div class="space-y-1">
              <div class="text-xs text-white/70">Адрес / кошелёк</div>
              <input
                v-model="withdrawAddress"
                type="text"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none"
                placeholder="Введите адрес USDT (TRC20 / ERC20)"
              />
            </div>
          </div>

          <button type="button" class="btn btn-glass-outline w-full rounded-xl py-3 withdraw-btn" @click="handleWithdraw">
            Отправить запрос
          </button>

          <div class="text-[11px] text-white/65 leading-snug flex items-start gap-1.5">
            <span>⚠️</span>
            <span>Указывайте адрес точно — переводы необратимы.</span>
          </div>
          <div class="text-[11px] text-white/60 leading-snug">
            {{ withdrawNote }}
          </div>
        </div>
      </section>
    </main>

    <QuickActions
      v-model="qa"
      fixed
      @games="goHome"
      @deposit="goDeposit"
      @profile="goProfile"
    />
  </div>
</template>

<style scoped>
.deposit-card {
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 18px 38px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.withdraw-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.compact-row {
  align-items: stretch;
}

.pay-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(66, 255, 209, 0.35), rgba(124, 92, 255, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: 15px;
  font-weight: 800;
  box-shadow:
    0 10px 30px rgba(90, 200, 255, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition:
    transform 150ms ease,
    box-shadow 180ms ease,
    filter 180ms ease;
}

.pay-btn:hover {
  box-shadow:
    0 14px 34px rgba(90, 200, 255, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 0 12px rgba(124, 92, 255, 0.35));
}

.pay-btn:active {
  transform: scale(0.96);
}

.pay-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.pay-label {
  letter-spacing: 0.02em;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.withdraw-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-weight: 700;
  transition:
    transform 150ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.withdraw-btn:hover {
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.withdraw-btn:active {
  transform: scale(0.96);
}
</style>
