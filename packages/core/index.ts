import { setupInstall } from './makeInstaller'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from "./components"
import '@learn-ui-to-me/theme/index.css'

library.add(fas)
const installer = setupInstall(components)

export * from '@learn-ui-to-me/components'
export * from '@learn-ui-to-me/locale'
export default installer
