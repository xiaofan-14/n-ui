import { setupInstall } from '@learn-ui/utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from "./components"
import '@learn-ui/theme/index.css'

library.add(fas)
const installer = setupInstall(components)

export * from '../components'
export default installer