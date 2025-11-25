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
const depositAmount = ref<string>('50')
const depositNote = ref<string>('После оплаты проверь статус — зачисление может занять до 1-2 минут.')

const withdrawCurrency = ref<Currency>(currencies[0])
const withdrawAmount = ref<string>('25')
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
  depositAmount.value = String(val)
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
      <div class="mx-auto w-full max-w-[540px] px-4 py-3 flex items-center gap-3">
        <div class="text-lg font-semibold">Депозит</div>
        <div class="flex-1" />
        <button class="btn btn-xs btn-ghost" @click="goHome">Домой</button>
      </div>
      <LiveTicker />
    </header>

    <main class="mx-auto max-w-[540px] px-4 py-5 flex flex-col gap-4 pb-24">
      <section class="glass-card p-4 space-y-3 relative overflow-hidden">
        <div
          class="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
          style="
            background:
              radial-gradient(160px 160px at 15% 20%, #3AC1FF, transparent),
              radial-gradient(220px 220px at 85% 80%, #7C5CFF, transparent);
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

          <div class="flex items-center gap-3">
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
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="p in presets"
                :key="p"
                class="btn btn-sm btn-glass-outline rounded-xl"
                @click="setPreset(p)"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <button type="button" class="btn btn-glass-outline w-full rounded-xl py-3" @click="handlePay">
            Оплатить в CryptoBot
          </button>

          <div class="text-xs text-white/70 leading-snug">
            {{ depositNote }}
          </div>
        </div>
      </section>

      <section class="glass-card p-4 space-y-3 relative overflow-hidden">
        <div
          class="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
          style="
            background:
              radial-gradient(150px 150px at 80% 15%, #7C5CFF, transparent),
              radial-gradient(200px 200px at 10% 90%, #3AC1FF, transparent);
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
              <div class="text-xs text-white/70">Сумма</div>
              <input
                v-model="withdrawAmount"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-lg font-semibold outline-none"
                placeholder="0.00"
              />
            </div>
            <div class="space-y-1">
              <div class="text-xs text-white/70">Адрес / кошелёк</div>
              <input
                v-model="withdrawAddress"
                type="text"
                class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none"
                placeholder="Введите адрес или тег"
              />
            </div>
          </div>

          <button type="button" class="btn btn-glass-outline w-full rounded-xl py-3" @click="handleWithdraw">
            Отправить запрос
          </button>

          <div class="text-xs text-white/70 leading-snug">
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
