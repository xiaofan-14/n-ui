import Message from './src/methods'
import { withInstallFunction } from '@learn-ui-to-me/utils'

export const ErMessage = withInstallFunction(Message, '$message')

export * from './src/message'
