import Button from './src/button.vue'
import ButtonGroup from "./src/button-group.vue"
import { withInstall } from "@n-ui/utils"

export const NButton = withInstall(Button)
export const NButtonGroup = withInstall(ButtonGroup)

export * from './src/button.ts'
