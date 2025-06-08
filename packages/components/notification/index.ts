import Notification from "./src/methods"
import { withInstallFunction } from "@n-ui/utils"

export const NNotification = withInstallFunction(Notification, '$notify')

export * from './src/notification'
