import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import installElementPlus from './plugins/element'
import installFontAwesome from './plugins/font-awesome'

import './styles/global.css'
import './styles/element.scss'

const app = createApp(App)

app.use(store, key).use(router)
installElementPlus(app)
installFontAwesome(app)

app.mount('#app')
