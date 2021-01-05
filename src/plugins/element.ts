import {
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElInput,
  ElCard,
  ElSwitch
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
import { App } from 'vue'

const components = [
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElInput,
  ElCard,
  ElSwitch
]

export default (app: App) => {
  locale.use(lang)

  components.forEach(component => {
    app.component(component.name, component)
  })
}
