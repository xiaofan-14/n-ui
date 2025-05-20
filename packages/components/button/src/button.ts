import type {ComputedRef, Ref, VNode} from "vue";

export type buttonType = 'primary' | 'default' | 'success' | 'warning' | 'danger'
export type buttonSize = 'small' | 'default' | 'large'
export type nativeType = 'button' | 'submit' | 'reset'

export interface buttonProps {
  id?: string
  tag?: string | VNode
  type?: buttonType
  size?: buttonSize
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
  nativeType?: nativeType
  emits?: ['click', 'onClick']
}

export interface buttonGroupProps {
  size?: buttonSize,
  type?: buttonType,
  disabled?: boolean
}


export interface buttonGroupContext {
  size?: buttonSize,
  type?: buttonType,
  disabled?: boolean
}

/**
 * 导出的 button 实例
 */
export interface buttonInstance {
  ref: Ref<HTMLButtonElement | void>
  disabled: ComputedRef<boolean>
  size: ComputedRef<buttonSize | ''>
  type: ComputedRef<buttonType | ''>
}
