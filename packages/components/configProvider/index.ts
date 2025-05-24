import configProvider from "./configProvider.vue"
import { withInstall } from '@learn-ui-to-me/utils'


export const ErConfigProvider = withInstall(configProvider)

export * from './types'
export * from './hooks'
