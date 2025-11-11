import { SLOT_ITEMS, type SlotItem } from './constants'
export function generateBetArray(): number[] {
  const arr = Array.from(new Set(SLOT_ITEMS.map(i => i.multiplier))).sort((a, b) => a - b)
  return arr
}

// выбрать случайный элемент с весами (guard от пустого массива)
export function weightedPick<T extends { weight: number }>(arr: readonly T[], rnd = Math.random): T {
  if (!arr.length) throw new Error('weightedPick: empty array')

  const sum = arr.reduce((s, a) => s + a.weight, 0)
  let r = rnd() * sum
  for (const it of arr) {
    r -= it.weight
    if (r <= 0) return it
  }
  // сюда почти никогда не попадём, но на случай погрешностей:
  return arr[arr.length - 1] as T
}

// сгенерировать комбинацию слотов под заданный итоговый множитель
export function getSlotCombination(
  n: number,
  multiplier: number | null,
  betArray: number[],
  rnd = Math.random,
): SlotItem[] {
  if (multiplier && betArray.includes(multiplier)) {
    // выигрыш: все одинаковые
    const item =
      SLOT_ITEMS.find(i => i.multiplier === multiplier) ??
      weightedPick(SLOT_ITEMS, rnd)
    return Array.from({ length: n }, () => item)
  }

  // проигрыш: минимум один отличается
  const base = weightedPick(SLOT_ITEMS, rnd)
  const pool = SLOT_ITEMS.filter(i => i.id !== base.id)
  const other = weightedPick(pool.length ? pool : SLOT_ITEMS, rnd) // fallback если вдруг один элемент в таблице

  return Array.from({ length: n - 1 }, () => base).concat(other)
}
