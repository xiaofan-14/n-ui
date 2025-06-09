import type { InjectionKey } from 'vue'
import type { ButtonGroupContext } from './button.ts'

export const BUTTON_GROUP_CTX:InjectionKey<ButtonGroupContext> = Symbol('BUTTON_GROUP_CTX')
