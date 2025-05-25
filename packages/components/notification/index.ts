import Notification from "./src/methods"
import { withInstallFunction } from "@learn-ui-to-me/utils"

export const ErNotification = withInstallFunction(Notification, '$notify')

export * from './src/notification'
