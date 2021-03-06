import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
  faThumbtack,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

library.add(faLongArrowAltUp, faLongArrowAltDown, faThumbtack, faSearch)

export default (app: App) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
