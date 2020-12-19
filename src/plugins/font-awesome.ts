import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

library.add(faUserSecret)

export default (app: App) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
