import { ref } from 'vue'
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  NUM_SLOTS,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_WIN,
  SOUND_SPIN,
  SPIN_DELAY,
  type SlotItem,
} from './constants'
import { generateBetArray, getSlotCombination } from './utils'
// если с '@' всё ещё бывает боль — оставь относительный импорт:
import { playSfx } from '../../utils/sfx'

export function useSlotMachine() {
  const spinning = ref(false)
  const good = ref(false)
  const revealedSlots = ref(NUM_SLOTS)
  const combination = ref<SlotItem[]>(
  Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]!)

)

  const resultMultiplier = ref<number | null>(null)
  const betArray = ref<number[]>(generateBetArray())
  const wager = ref(1)

  function setWager(v: number) {
    wager.value = Math.max(1, Math.floor(v))
    betArray.value = generateBetArray()
  }

  function revealSlot(comb: SlotItem[], slot = 0) {
    playSfx(SOUND_REVEAL)

    const curr = comb[slot]! // comb длиной NUM_SLOTS
    const allSame = comb.slice(0, slot + 1).every((item, index, arr) => !index || item.id === arr[index - 1]!.id)

    if (curr.multiplier >= LEGENDARY_THRESHOLD && allSame) {
      playSfx(SOUND_REVEAL_LEGENDARY)
    }

    revealedSlots.value = slot + 1

    if (slot < NUM_SLOTS - 1) {
      setTimeout(() => revealSlot(comb, slot + 1), REVEAL_SLOT_DELAY)
    } else {
      setTimeout(() => {
        spinning.value = false
        if (allSame) {
          good.value = true
          playSfx(SOUND_WIN)
        } else {
          playSfx(SOUND_LOSE)
        }
      }, FINAL_DELAY)
    }
  }

  async function spin() {
    try {
      spinning.value = true
      resultMultiplier.value = null
      playSfx(SOUND_PLAY)

      revealedSlots.value = 0
      good.value = false

      const start = Date.now()
      playSfx(SOUND_SPIN)

      // шанс победы ~10%
      const isWin = Math.random() < 0.1
      const picked = isWin
        ? betArray.value[Math.floor(Math.random() * betArray.value.length)]
        : null
      const pickedMultiplier: number | null = picked ?? null

      const delayLeft = Math.max(0, SPIN_DELAY - (Date.now() - start))
      const comb = getSlotCombination(NUM_SLOTS, pickedMultiplier, betArray.value)

      combination.value = comb
      resultMultiplier.value = pickedMultiplier

      setTimeout(() => revealSlot(comb), delayLeft)
    } catch (e) {
      spinning.value = false
      revealedSlots.value = NUM_SLOTS
      throw e
    }
  }

  if (import.meta.env.DEV) {
    console.log('NUM_SLOTS', NUM_SLOTS)
    console.log('init combination length', combination.value.length)
  }

  return { spinning, good, revealedSlots, combination, wager, betArray, setWager, spin }
}