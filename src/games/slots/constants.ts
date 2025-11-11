import { symbolImages } from './assets'

export type SlotItem = {
  id: keyof typeof symbolImages
  image: string
  multiplier: number
  weight: number
}

export const NUM_SLOTS = 3

// тайминги (мс) — близко к их значениям
export const SPIN_DELAY = 1200
export const REVEAL_SLOT_DELAY = 250
export const FINAL_DELAY = 350
export const LEGENDARY_THRESHOLD = 25 // что считаем "легендарным" хитом (под спец. звук/эффект)

// звуки, если используешь мой soundFiles — просто строки-ключи
export const SOUND_SPIN = 'spin'
export const SOUND_PLAY = 'play'
export const SOUND_REVEAL = 'reveal'
export const SOUND_REVEAL_LEGENDARY = 'revealLegendary'
export const SOUND_WIN = 'money'
export const SOUND_LOSE = 'lose'

// Портируй из Gamba их список предметов/мультипликаторов.
// Я заполнил пример на основе твоих ассетов. Отредачь по желанию.
export const SLOT_ITEMS: SlotItem[] = [
  { id: 'win2',   image: symbolImages.win2,   multiplier: 2,  weight: 40 },
  { id: 'win3',   image: symbolImages.win3,   multiplier: 3,  weight: 28 },
  { id: 'win5',   image: symbolImages.win5,   multiplier: 5,  weight: 18 },
  { id: 'cool',   image: symbolImages.cool,   multiplier: 8,  weight: 8  },
  { id: 'hearts', image: symbolImages.hearts, multiplier: 12, weight: 4  },
  { id: 'unicorn',image: symbolImages.unicorn,multiplier: 20, weight: 2  },
  { id: 'wojak',  image: symbolImages.wojak,  multiplier: 50, weight: 1  },
]
