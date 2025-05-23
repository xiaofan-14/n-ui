import type { InjectionKey } from "vue"
import type { dropdownContext } from "./dropdown"

export const DROPDOWN_CTX_KEY:InjectionKey<dropdownContext> = Symbol('dropdownContext')
