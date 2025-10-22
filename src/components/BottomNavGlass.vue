<template>
  <div class="fixed left-0 right-0 bottom-3 px-4" :style="{ paddingBottom: 'calc(8px + var(--safe-bottom))' }">
    <div class="mx-auto max-w-sm">
      <div class="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/10 px-2 py-2 shadow-glass">
        <button class="btn btn-ghost btn-sm rounded-full">🏠</button>
        <button class="btn btn-ghost btn-sm rounded-full">🎮</button>
        <button class="btn btn-primary btn-sm rounded-full shrink-0 w-14 h-14 -mt-6 z-10">＋</button>
        <button class="btn btn-ghost btn-sm rounded-full">💬</button>
        <button class="btn btn-ghost btn-sm rounded-full">👤</button>
      </div>
    </div>
  </div>
</template>