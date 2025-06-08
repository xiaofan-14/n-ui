import form from './src/form.vue'
import formItem from './src/formItem.vue'
import {  withInstall } from '@n-ui/utils'

export const NForm = withInstall(form)
export const NFormItem = withInstall(formItem)

export * from './src/form.ts'
export * from './src/hooks.ts'
