import Message from './src/methods'
import { withInstallFunction } from '@n-ui/utils'

export const NMessage = withInstallFunction(Message, '$message')

export * from './src/message'
