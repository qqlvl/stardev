// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
const Home = () => import('./AppHome.vue')
const GameHost = () => import('./views/GameHost.vue') //
const Profile = () => import('./views/Profile.vue')
const Deposit = () => import('./views/Deposit.vue')
// const Play = () => import('./pages/Play.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/deposit', name: 'deposit', component: Deposit },
  { path: '/play/:id', name: 'play', component: GameHost, props: true },
  { path: '/profile', name: 'profile', component: Profile },
//   { path: '/play/:id', name: 'play', component: Play, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
