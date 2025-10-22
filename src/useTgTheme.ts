// src/useTgTheme.ts
type ThemeParams = Partial<{
  bg_color: string
  text_color: string
  hint_color: string
  link_color: string
  button_color: string
  button_text_color: string
}>

export function applyTgTheme() {
  const tg = (window as any).Telegram?.WebApp
  if (!tg) return

  const setVars = (tp?: ThemeParams) => {
    if (!tp) return
    const root = document.documentElement.style
    if (tp.bg_color) root.setProperty('--tg-bg', tp.bg_color)
    if (tp.text_color) root.setProperty('--tg-text', tp.text_color)
    if (tp.hint_color) root.setProperty('--tg-hint', tp.hint_color)
    if (tp.link_color) root.setProperty('--tg-link', tp.link_color)
    if (tp.button_color) root.setProperty('--tg-btn', tp.button_color)
    if (tp.button_text_color) root.setProperty('--tg-btn-text', tp.button_text_color)
  }

  // первичная заливка
  setVars(tg.themeParams)

  // обновление при смене темы
  tg.onEvent?.('theme_changed', () => setVars(tg.themeParams))
}
