import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/tippy.css' // Base styles
import 'tippy.js/themes/translucent.css' // For theme="light"

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueTippy, {
  defaultProps: {
    placement: 'bottom', // Default placement for all Tippy instances
    theme: 'translucent', // Default theme
    allowHTML: true, // Allow HTML in content by default
    animation: 'shift-away',
    touch: false,
    popperOptions: {
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top'], // Restrict fallback to bottom and top
          },
        },
      ],
    },
  },
})

app.mount('#app')
