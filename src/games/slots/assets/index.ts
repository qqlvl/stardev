// src/games/slots/assets/index.ts
import win2 from './slot-2x.png'
import win3 from './slot-3x.png'
import win5 from './slot-5x.png'
import cool from './slot-emoji-cool.png'
import hearts from './slot-emoji-hearts.png'
import unicorn from './slot-unicorn.png'
import wojak from './slot-wojak.png'
// добавляй остальные по мере копирования

// звуки
import coin from './coin.mp3'
import insert from './insert.mp3'
import lose from './lose.mp3'
import money from './money.mp3'
import play from './play.mp3'
import revealLegendary from './reveal-legendary.mp3'
import reveal from './reveal.mp3'
import spin from './spin.mp3'


export const symbolImages = {
  win2,
  win3,
  win5,
  cool,
  hearts,
  unicorn,
  wojak,
  // ...
} as const

export const soundFiles = {
  coin,
  insert,
  lose,
  money,
  play,
  revealLegendary,
  reveal,
  spin,
} as const

export type SoundId = keyof typeof soundFiles


export type SymbolId = keyof typeof symbolImages
