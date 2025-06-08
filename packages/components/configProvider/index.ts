import configProvider from "./configProvider.vue"
import { withInstall } from '@n-ui/utils'


export const NConfigProvider = withInstall(configProvider)

export * from './types'
export * from './hooks'
