import type { InjectionKey } from 'vue'
import type { buttonGroupContext } from './button.ts'

export const BUTTON_GROUP_CTX:InjectionKey<buttonGroupContext> = Symbol('BUTTON_GROUP_CTX')