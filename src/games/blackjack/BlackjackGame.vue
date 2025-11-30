<script setup lang="ts">
import { computed, ref } from 'vue'
import cardBackImg from '@/assets/img/cards/backcard.png'

type Suit = '♠' | '♥' | '♦' | '♣'
type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
type Card = { rank: Rank; suit: Suit }
type Phase = 'idle' | 'player' | 'dealer' | 'finished'
type HandStatus = 'playing' | 'stand' | 'bust' | 'win' | 'lose' | 'push'
type Hand = { cards: Card[]; bet: number; status: HandStatus }

const suits: Suit[] = ['♠', '♥', '♦', '♣']
const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']

const deck = ref<Card[]>([])
const dealerCards = ref<Card[]>([])
const dealerHidden = ref<boolean>(true)
const phase = ref<Phase>('idle')
const result = ref<string>('')

const playerHands = ref<Hand[]>([])
const activeHandIndex = ref<number>(0)
const hasMultipleHands = computed(() => playerHands.value.length > 1)

const balance = ref<number>(500)
const bet = ref<number>(25)

const currentHand = computed<Hand | null>(() => playerHands.value[activeHandIndex.value] ?? null)
const playerCards = computed<Card[]>(() => currentHand.value?.cards ?? [])

const playerScore = computed(() => calcScore(playerCards.value))
const dealerScore = computed(() => calcScore(dealerCards.value))
const dealerDisplayScore = computed(() => (dealerHidden.value ? '?' : dealerScore.value))
const isBettingPhase = computed(() => phase.value === 'idle' || phase.value === 'finished')
const isPlayerPhase = computed(() => phase.value === 'player')

const canBet = computed(() => bet.value > 0 && bet.value <= balance.value && phase.value !== 'player')
const canHit = computed(() => phase.value === 'player')
const canStand = computed(() => phase.value === 'player')
const canSplit = computed(() => {
  if (phase.value !== 'player') return false
  const hand = currentHand.value
  if (!hand || hand.cards.length !== 2) return false
  if (hand.bet * 2 > balance.value) return false
  const [a, b] = hand.cards as [Card, Card]
  return normalizeRank(a.rank) === normalizeRank(b.rank)
})
const canDouble = computed(() => {
  if (phase.value !== 'player') return false
  const hand = currentHand.value
  if (!hand || hand.cards.length !== 2) return false
  if (hand.bet * 2 > balance.value) return false
  return true
})

function buildDeck() {
  const fresh: Card[] = []
  suits.forEach((s) => {
    ranks.forEach((r) => fresh.push({ rank: r, suit: s }))
  })
  deck.value = shuffle(fresh)
}

function shuffle<T>(arr: T[]) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = temp
  }
  return copy
}

function drawCard(): Card {
  if (deck.value.length === 0) buildDeck()
  return deck.value.pop() as Card
}

function calcScore(cards: Card[]) {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank === 'A') {
      total += 11
      aces += 1
    } else if (['K', 'Q', 'J'].includes(c.rank)) {
      total += 10
    } else {
      total += Number(c.rank)
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

function normalizeRank(rank: Rank) {
  if (rank === 'K' || rank === 'Q' || rank === 'J' || rank === '10') return '10'
  return rank
}

function resetRound() {
  playerHands.value = []
  activeHandIndex.value = 0
  dealerCards.value = []
  dealerHidden.value = true
  result.value = ''
}

function startRound() {
  if (!canBet.value) return
  resetRound()
  phase.value = 'player'
  buildDeck()
  playerHands.value = [
    { cards: [drawCard(), drawCard()], bet: bet.value, status: 'playing' },
  ]
  dealerCards.value = [drawCard(), drawCard()]
  if (playerScore.value === 21) {
    dealerTurn()
  }
}

function hit() {
  if (!canHit.value) return
  if (!currentHand.value) return
  currentHand.value.cards = [...currentHand.value.cards, drawCard()]
  const score = calcScore(currentHand.value.cards)
  if (score > 21) {
    currentHand.value.status = 'bust'
    moveToNextHandOrDealer()
  } else if (score === 21) {
    stand()
  }
}

function stand() {
  if (!canStand.value) return
  if (!currentHand.value) return
  currentHand.value.status = 'stand'
  moveToNextHandOrDealer()
}

function dealerTurn() {
  dealerHidden.value = false
  phase.value = 'dealer'
  while (dealerScore.value < 17) {
    dealerCards.value = [...dealerCards.value, drawCard()]
  }
  settleHands()
}

function settleHands() {
  const dScore = dealerScore.value
  const dealerBust = dScore > 21
  const summaries: string[] = []

  playerHands.value.forEach((hand, idx) => {
    const score = calcScore(hand.cards)
    let outcome: 'win' | 'lose' | 'push'
    if (hand.status === 'bust') {
      outcome = 'lose'
    } else if (dealerBust) {
      outcome = 'win'
    } else if (score > dScore) {
      outcome = 'win'
    } else if (score < dScore) {
      outcome = 'lose'
    } else {
      outcome = 'push'
    }

    if (outcome === 'win') balance.value += hand.bet
    if (outcome === 'lose') balance.value -= hand.bet
    hand.status = outcome

    summaries.push(`Hand ${idx + 1}: ${outcome}`)
  })

  phase.value = 'finished'
  result.value = summaries.join(' · ')
}

function betHalf() {
  bet.value = Number(Math.max(1, bet.value / 2).toFixed(2))
}

function betDouble() {
  bet.value = Number(Math.min(balance.value, bet.value * 2).toFixed(2))
}

function betMax() {
  bet.value = Number(balance.value.toFixed(2))
}

function doubleDown() {
  if (!canDouble.value) return
  if (!currentHand.value) return
  currentHand.value.bet = Number(Math.min(balance.value, currentHand.value.bet * 2).toFixed(2))
  hit()
  if (phase.value === 'player') stand()
}

function handleSplit() {
  if (!canSplit.value) return
  const hand = currentHand.value
  if (!hand || hand.cards.length !== 2) return
  const [c1, c2] = hand.cards as [Card, Card]
  // нужно иметь баланс на второй бокс
  if (bet.value > balance.value) return
  playerHands.value = [
    { cards: [c1, drawCard()], bet: bet.value, status: 'playing' },
    { cards: [c2, drawCard()], bet: bet.value, status: 'playing' },
  ]
  activeHandIndex.value = 0
}

function moveToNextHandOrDealer() {
  const nextIdx = playerHands.value.findIndex(
    (h, idx) => idx > activeHandIndex.value && h.status === 'playing',
  )
  if (nextIdx !== -1) {
    activeHandIndex.value = nextIdx
    return
  }
  const stillPlaying = playerHands.value.some((h) => h.status === 'playing')
  if (stillPlaying) return
  dealerTurn()
}
</script>

<template>
  <div class="blackjack">
    <header class="top-row">
      <div class="flex-1" />
      <div class="flex-1" />
    </header>

    <section class="table">
      <div class="dealer-area">
        <div v-if="dealerCards.length" class="dealer-score">{{ dealerDisplayScore }}</div>
        <TransitionGroup
          appear
          v-if="dealerCards.length"
          name="deal"
          tag="div"
          class="cards-row stacked"
        >
          <div
            class="card"
            v-for="(card, idx) in dealerCards"
            :key="`d-${idx}-${card.rank}-${card.suit}`"
            :style="{ '--z': 100 - idx, '--deal-delay': `${idx * 70}ms` }"
          >
            <div class="card-inner" :class="{ 'show-back': idx === 1 && dealerHidden }">
              <div
                class="card-face card-back"
                :style="{ '--card-back-img': `url(${cardBackImg})` }"
              />
              <div class="card-face card-front" :data-suit="card.suit">
                <span class="rank">{{ card.rank }}</span>
                <span class="suit">{{ card.suit }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <div v-else class="cards-row stacked placeholder">
          <div class="card">
            <div class="card-inner show-back">
              <div
                class="card-face card-back"
                :style="{ '--card-back-img': `url(${cardBackImg})` }"
              />
            </div>
          </div>
          <div class="card">
            <div class="card-inner show-back">
              <div
                class="card-face card-back"
                :style="{ '--card-back-img': `url(${cardBackImg})` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="divider">
        <span>STAR BLACKJACK</span>
      </div>

      <div class="player-area">
        <div v-if="playerHands.length" class="hands-grid">
          <div
            v-for="(hand, hIdx) in playerHands"
            :key="`hand-${hIdx}`"
            class="hand-wrap"
            :class="{
              active: hIdx === activeHandIndex,
              inactive: hasMultipleHands && hIdx !== activeHandIndex,
              bust: hand.status === 'bust',
              win: hand.status === 'win',
              lose: hand.status === 'lose',
              push: hand.status === 'push',
            }"
            :style="{ '--hand-offset': `${hIdx * 12}px` }"
          >
            <div class="hand-score">{{ calcScore(hand.cards) }}</div>
            <TransitionGroup appear name="deal" tag="div" class="cards-row stacked hand-cards">
              <div
                class="card"
                v-for="(card, idx) in hand.cards"
                :key="`p-${hIdx}-${idx}-${card.rank}-${card.suit}`"
                :style="{ '--z': 100 - idx, '--deal-delay': `${idx * 70}ms` }"
              >
                <div class="card-inner">
                  <div class="card-face card-front" :data-suit="card.suit">
                    <span class="rank">{{ card.rank }}</span>
                    <span class="suit">{{ card.suit }}</span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
        <div v-else class="cards-row stacked placeholder">
          <div class="card">
            <div class="card-inner show-back">
              <div
                class="card-face card-back"
                :style="{ '--card-back-img': `url(${cardBackImg})` }"
              />
            </div>
          </div>
          <div class="card">
            <div class="card-inner show-back">
              <div
                class="card-face card-back"
                :style="{ '--card-back-img': `url(${cardBackImg})` }"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="controls">
      <template v-if="isPlayerPhase">
        <div class="actions-row">
          <button type="button" class="btn-glass-outline action-btn" :disabled="!canHit" @click="hit">
            Hit
          </button>
          <button type="button" class="btn-glass-outline action-btn" :disabled="!canStand" @click="stand">
            Stand
          </button>
          <button
            type="button"
            class="btn-glass-outline action-btn"
            :class="{ ghost: !canSplit }"
            :disabled="!canSplit"
            @click="handleSplit"
          >
            Split
          </button>
          <button
            type="button"
            class="btn-glass-outline action-btn"
            :class="{ ghost: !canDouble }"
            :disabled="!canDouble"
            @click="doubleDown"
          >
            Double
          </button>
        </div>
      </template>

      <template v-else-if="isBettingPhase">
        <div class="bet-section">
          <div class="bet-card">
            <div class="bet-inner">
              <div class="bet-input-wrap">
                <span class="bet-currency">$</span>
                <input
                  id="bet"
                  v-model.number="bet"
                  type="number"
                  min="1"
                  step="0.01"
                  name="bet"
                  class="bet-input"
                />
              </div>
              <div class="bet-inline-actions">
                <div class="bet-modifiers-inline">
                  <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betHalf">
                    1/2
                  </button>
                  <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betDouble">
                    2x
                  </button>
                  <button type="button" class="btn-glass-outline bet-chip bet-chip-sm" @click="betMax">
                    MAX
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bet-actions single">
            <button
              type="button"
              class="btn bet-btn"
              :disabled="!canBet"
              @click="startRound"
            >
              Bet
            </button>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.blackjack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.game-title {
  display: none;
}

.pill {
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pill.ghost {
  opacity: 0.6;
}

.balance-pill {
  display: none;
}

.score-badge {
  min-width: 58px;
  text-align: center;
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 900;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 12px 14px;
  min-height: 400px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(27, 41, 62, 0.92), rgba(13, 20, 32, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.dealer-area {
  position: relative;
  padding-top: 26px;
}

.cards-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  min-height: 140px;
  align-content: center;
  flex-wrap: wrap;
}

.cards-row.stacked {
  gap: 0;
}

.cards-row.stacked .card {
  margin-left: -30px;
  z-index: var(--z, 1);
}

.cards-row.stacked .card:first-child {
  margin-left: 0;
}

.cards-row.placeholder .card {
  opacity: 1;
  filter: none;
}

.hands-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.hand-wrap {
  position: relative;
  padding-top: 16px;
  transform: translateY(var(--hand-offset, 0));
  transition: box-shadow 180ms ease, transform 180ms ease, opacity 180ms ease;
  padding-bottom: 6px;
}

.hand-wrap.active {
  box-shadow: none;
}

.hand-wrap.bust {
  opacity: 0.7;
}

.hand-wrap.inactive {
  opacity: 0.65;
  filter: grayscale(0.35);
}

.hand-wrap.win .hand-score {
  background: #16a34a;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.4);
}
.hand-wrap.lose .hand-score {
  background: #ef4444;
}
.hand-wrap.push .hand-score {
  background: #6b7280;
}

.hand-score {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -60%);
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(239, 68, 68, 0.35);
  z-index: 12;
}

.card {
  width: 82px;
  height: 108px;
  border-radius: 12px;
  background: transparent;
  perspective: 1000px;
  transform-origin: center center;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transform-style: preserve-3d;
  transition: transform 320ms ease;
}

.card-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  backface-visibility: hidden;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.card-front {
  background: #f7f8fa;
  color: #0f172a;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.card-back {
  background-color: #0f1b2d;
  background-image:
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)),
    var(--card-back-img);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: rotateY(180deg);
}

.card-inner.show-back {
  transform: rotateY(180deg);
}

.card-front[data-suit='♥'],
.card-front[data-suit='♦'] {
  color: #e11d48;
}

.rank {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.suit {
  font-size: 24px;
}

.divider {
  text-align: center;
  font-size: 11px;
  opacity: 0.6;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.player-area {
  position: relative;
  padding-top: 14px;
  padding-bottom: 10px;
}

.player-score {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: #fff;
  font-weight: 900;
  padding: 6px 12px;
  border-radius: 999px;
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.35);
  z-index: 10;
}

.dealer-score {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
  z-index: 10;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.action-btn {
  width: 100%;
  padding: 10px 0;
  font-weight: 800;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.action-btn.ghost {
  opacity: 0.4;
}

.bet-row {
  /* старые стили не используются */
}

/* ===== СТИЛИ БЕТ-БЛОКА как в слотах ===== */
.bet-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.bet-card {
  border-radius: 20px;
  background: transparent;
  border: none;
  box-shadow: none;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
}

.bet-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
  width: 100%;
}

.bet-input-wrap {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}

.bet-currency {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  color: #45d674;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.bet-inline-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.bet-modifiers-inline {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bet-input {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  padding: 10px 8px 10px 28px;
  width: 50px;
}

.bet-input::-webkit-outer-spin-button,
.bet-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.bet-input[type='number'] {
  -moz-appearance: textfield;
}

.bet-chip {
  min-width: 78px;
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.bet-chip-sm {
  min-width: 56px;
  height: 32px;
  padding: 0 5px;
  font-size: 12px;
}

.bet-chip:hover {
  transform: translateY(-1px);
}

.bet-chip:active {
  transform: translateY(0);
}

.bet-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0;
  align-items: center;
  width: 100%;
}

.bet-actions.single {
  margin-top: 0;
}

.bet-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #0b1c11;
  font-weight: 900;
  border: none;
  padding: 12px 18px;
  border-radius: 14px;
  box-shadow:
    0 10px 24px rgba(34, 197, 94, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  min-height: 48px;
  width: 100%;
}

.bet-btn:disabled {
  opacity: 0.4;
}


/* Появление карт */
.deal-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.92);
}
.deal-enter-active {
  transition:
    transform 320ms ease var(--deal-delay, 0ms),
    opacity 320ms ease var(--deal-delay, 0ms);
}
.deal-leave-active {
  transition: opacity 160ms ease;
}
.deal-leave-to {
  opacity: 0;
}
</style>
import { computed, ref } from 'vue'
import cardBackImg from '@/assets/img/cards/backcard.png'
import { quickBets } from '../slots/constants'
