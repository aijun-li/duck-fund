import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLongArrowAltUp,
  faLongArrowAltDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

library.add(faLongArrowAltUp, faLongArrowAltDown)

export default (app: App) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
