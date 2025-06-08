import select from "./src/select.vue"
import option from "./src/option.vue"

import { withInstall } from "@n-ui/utils";

export const NSelect = withInstall(select)
export const NOption = withInstall(option)

export * from './src/select'
