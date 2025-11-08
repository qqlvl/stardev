export const gamesRegistry: Record<string, () => Promise<any>> = {
  slots: () => import('./slots/SlotsGame.vue'),
}