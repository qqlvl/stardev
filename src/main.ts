import './styles.css'
import { createApp } from 'vue'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import { router } from './router'


// ✅ собираем приложение
const app = createApp(App)

// ✅ подключаем плагины
app.use(router)
app.use(MotionPlugin)

// ✅ монтируем
app.mount('#app')