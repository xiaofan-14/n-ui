import type { App, Plugin } from 'vue'
import { each } from 'lodash-es'
import { provideGlobalConfig } from '@learn-ui-to-me/components'
import type { configProviderProps } from '@learn-ui-to-me/components'

export function setupInstall(components: Plugin[]) {
  function installer(app: App, opts?: configProviderProps) {
    each(components, (c: Plugin) => app.use(c))
    if (opts) provideGlobalConfig(opts, app, true)
  }

  return installer as Plugin
}

export default setupInstall
