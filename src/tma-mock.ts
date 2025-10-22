// src/tma-mock.ts
import { mockTelegramEnv } from '@tma.js/sdk'

if (import.meta.env.DEV) {
  const theme = {
    bg_color: '#17212b',
    text_color: '#f5f5f5',
    hint_color: '#708499',
    link_color: '#6ab3f3',
    button_color: '#111827',
    button_text_color: '#ffffff',
  }

  const init = new URLSearchParams()
  init.set('auth_date', String(Math.trunc(Date.now() / 1000)))
  init.set('hash', 'mock')
  init.set('signature', 'mock-signature')
  init.set('user', JSON.stringify({ id: 1, first_name: 'Dev', username: 'you' }))

  const lp = new URLSearchParams()
  lp.set('tgWebAppVersion', '8.4')
  lp.set('tgWebAppPlatform', 'tdesktop')
  lp.set('tgWebAppData', init.toString())
  lp.set('tgWebAppThemeParams', JSON.stringify(theme))

  try {
    mockTelegramEnv({ launchParams: lp })
  } catch (e) {
    console.warn('[TMA MOCK] sdk mock failed:', e)
  }

  // ЖЁСТКАЯ ПРОПИСКА — даже если SDK не создал поля
  const w = window as any
  w.Telegram = w.Telegram || {}
  w.Telegram.WebApp = w.Telegram.WebApp || {}
  const WA = w.Telegram.WebApp

  WA.platform ??= 'tdesktop'
  WA.themeParams = { ...(WA.themeParams || {}), ...theme }
  WA.initData ??= lp.toString()
  WA.initDataUnsafe = {
    ...(WA.initDataUnsafe || {}),
    user: { id: 1, first_name: 'Dev', username: 'you' },
  }
  WA.ready ??= () => {}
  WA.expand ??= () => {}

  console.info('[TMA MOCK] applied → platform:', WA.platform)
}
