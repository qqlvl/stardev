<template>
  <div class="relative glass-card p-4 overflow-hidden">
    <div class="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
         style="background:
           radial-gradient(140px 140px at 80% 15%, #7C5CFF, transparent),
           radial-gradient(180px 180px at 10% 90%, #3AC1FF, transparent)">
    </div>

    <div class="flex items-center justify-between mb-1">
      <div class="text-sm opacity-80">Баланс</div>
    </div>

    <div class="text-4xl font-extrabold tracking-tight">$114.05</div>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <button class="btn btn-outline btn-sm rounded-xl">????</button>
      <button class="btn btn-primary btn-sm rounded-xl">Депозит</button>
    </div>
  </div>
</template>