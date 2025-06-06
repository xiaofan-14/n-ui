import form from './src/form.vue'
import formItem from './src/formItem.vue'
import {  withInstall } from '@learn-ui-to-me/utils'

export const ErForm = withInstall(form)
export const ErFormItem = withInstall(formItem)

export * from './src/form.ts'
export * from './src/hooks.ts'
