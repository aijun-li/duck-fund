import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import installFontAwesome from './plugins/font-awesome'

const app = createApp(App)

app.use(store).use(router)
installElementPlus(app)
installFontAwesome(app)

app.mount('#app')
