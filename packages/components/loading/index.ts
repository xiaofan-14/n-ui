import { vLoading } from './src/dirdctive'
import { Loading } from './src/service'
import type { App } from 'vue'

export const ErLoading = {
  name: 'ErLoading',
  install(app: App){
    app.directive('loading', vLoading)
    app.config.globalProperties.$loading = Loading
  },
  directive: vLoading,
  service: Loading
}

export default ErLoading

export {
  vLoading,
  vLoading as ErLoadingDirective,
  Loading as ErLoadingService
}

export * from './src/loading'

