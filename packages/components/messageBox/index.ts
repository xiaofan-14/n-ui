import MessageBox from './src/methods'
import { set } from 'lodash-es'
import type { App } from 'vue'

export const NMessageBox = MessageBox

set(NMessageBox, 'install', (app: App) => {
  app.config.globalProperties.$msgbox = MessageBox
  app.config.globalProperties.$messagebox = MessageBox
  app.config.globalProperties.$alert = MessageBox.alert
  app.config.globalProperties.$confirm = MessageBox.confirm
  app.config.globalProperties.$prompt = MessageBox.prompt
})

export default  NMessageBox

export * from './src/messageBox'
