import { soundFiles } from '../games/slots/assets'

export function playSfx(id: keyof typeof soundFiles, volume = 0.8) {
  const audio = new Audio(soundFiles[id])
  audio.volume = volume
  audio.play().catch(() => {
    // браузер может блокировать звук без взаимодействия
  })
}
