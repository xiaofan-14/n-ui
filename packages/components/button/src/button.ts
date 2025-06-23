import type {ComputedRef, Ref, VNode} from "vue";

// 按钮自定义类型
export type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger'
// 按钮大小
export type ButtonSize = 'small' | 'default' | 'large'
// 原生按钮类型
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  // 唯一标识符 id
  id?: string

  // 渲染的标签类型
  tag?: string | VNode

  // 按钮样式类型
  type?: ButtonType

  // 按钮尺寸
  size?: ButtonSize

  // 左侧图标，可以是图标名或 VNode
  icon?: string | VNode

  // 右侧图标，可以是图标名或 VNode
  suffixIcon?: string | VNode

  // 是否显示加载状态
  loading?: boolean

  // 是否禁用按钮
  disabled?: boolean

  // 是否为朴素按钮
  plain?: boolean

  // 是否开启点击节流
  debounce?: boolean

  // 是否为圆形按钮
  circle?: boolean

  // 是否为圆角按钮
  round?: boolean

  // 是否自动聚焦
  autofocus?: boolean

  // 是否启用节流
  useThrottle?: boolean

  // 若为 a 标签时生效的跳转链接
  href?: string

  // 自定义加载状态下的图标
  loadingIcon?: string

  // 节流延迟时间
  throttleDuration?: number

  // 原生 HTML 按钮类型
  nativeType?: NativeType
}

// 单击事件
export type ButtonEmits = {
  (event: 'click', evt: MouseEvent): void
}

/**
 * 按钮组属性
 *    size: 按钮组下每个按钮的大小
 *    type: 按钮组下每个按钮的类型
 *    disabled: 是否禁用按钮
 */
export interface ButtonGroupProps {
  size?: ButtonSize,
  type?: ButtonType,
  disabled?: boolean
}

/**
 * 按钮组实例上下文，通过依赖注入在按钮中使用
 */
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
