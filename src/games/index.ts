export const gamesRegistry: Record<string, () => Promise<any>> = {
  slots: () => import('./slots/SlotsGame.vue'),
  blackjack: () => import('./blackjack/BlackjackGame.vue'),
}
