import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import installElementPlus from './plugins/element'
import installFontAwesome from './plugins/font-awesome'
import axios from 'axios'

import './styles/global.css'
import './styles/element.scss'

const app = createApp(App)

app.use(store, key).use(router)
app.provide('axios', axios)
installElementPlus(app)
installFontAwesome(app)

app.mount('#app')
