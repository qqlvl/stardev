import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',          // чтобы не было плясок с /vuejs-template/
  server: { host: true }, // чтобы можно было открыть с телефона по локалке
})
