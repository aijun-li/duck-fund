import { ElButton } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
import { App } from 'vue'

const components = [ElButton]

export default (app: App) => {
  locale.use(lang)

  components.forEach(component => {
    app.component(component.name, component)
  })
}
