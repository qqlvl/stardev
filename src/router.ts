// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
const Home = () => import('./AppHome.vue')
// const Profile = () => import('./pages/Profile.vue')
// const Play = () => import('./pages/Play.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
//   { path: '/profile', name: 'profile', component: Profile },
//   { path: '/play/:id', name: 'play', component: Play, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
