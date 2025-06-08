import { vLoading } from './src/dirdctive'
import { Loading } from './src/service'
import type { App } from 'vue'

export const NLoading = {
  name: 'NLoading',
  install(app: App){
    app.directive('loading', vLoading)
    app.config.globalProperties.$loading = Loading
  },
  directive: vLoading,
  service: Loading
}

export default NLoading

export {
  vLoading,
  vLoading as NLoadingDirective,
  Loading as NLoadingService
}

export * from './src/loading'

