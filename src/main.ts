import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import installFontAwesome from './plugins/font-awesome'
import axios from 'axios'

const app = createApp(App)

app.use(store).use(router)
app.provide('axios', axios)
installElementPlus(app)
installFontAwesome(app)

app.mount('#app')
