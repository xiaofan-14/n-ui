import { setupInstall } from './makeInstaller'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from "./components"
import '@n-ui/theme/index.css'

library.add(fas)
const installer = setupInstall(components)

export * from '@n-ui/components'
export * from '@n-ui/locale'
export default installer
