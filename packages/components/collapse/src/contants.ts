import type { InjectionKey } from "vue"
import type { collapseContext } from "./collapse"

export const COLLAPSE_CTX_KEY: InjectionKey<collapseContext> = Symbol('collapseContext')