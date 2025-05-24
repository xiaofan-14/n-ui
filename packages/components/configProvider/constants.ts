import type { InjectionKey, Ref } from 'vue'
import type { configProviderProps } from './types'

export type configProviderContext = Partial<configProviderProps>

export const configProviderContextKey: InjectionKey<
  Ref<configProviderContext>
> = Symbol()
