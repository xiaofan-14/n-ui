import type {ComputedRef, Ref, VNode} from "vue";

export type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger'
export type ButtonSize = 'small' | 'default' | 'large'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  id?: string
  tag?: string | VNode
  type?: ButtonType
  size?: ButtonSize
  icon?: string | VNode
  suffixIcon?: string | VNode
  loading?: boolean
  disabled?: boolean
  plain?: boolean
  debounce?: boolean
  circle?: boolean
  round?: boolean
  autofocus?: boolean
  useThrottle?: boolean
  href?: string
  loadingIcon?: string,
  throttleDuration?: number
  nativeType?: NativeType
}

export type ButtonEmits = {
  (event: 'click', evt: MouseEvent): void
}

export interface ButtonGroupProps {
  size?: ButtonSize,
  type?: ButtonType,
  disabled?: boolean
}

export interface ButtonGroupContext {
  size?: ButtonSize,
  type?: ButtonType,
  disabled?: boolean
}

/**
 * 导出的 button 实例
 */
export interface ButtonInstance {
  ref: Ref<HTMLButtonElement | void>
  disabled: ComputedRef<boolean>
  size: ComputedRef<ButtonSize | ''>
  type: ComputedRef<ButtonType | ''>
}
