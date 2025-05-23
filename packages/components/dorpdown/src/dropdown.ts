import type { VNode, ComputedRef } from 'vue'
import type { tooltipProps } from '../../tooltip'
import type { buttonType, buttonSize } from '../../button'

export type dropdownCommand = string | number

export interface dropdownItemProps {
  command?: dropdownCommand
  label?: string | VNode
  disabled?: boolean
  divided?: boolean
}

export interface dropdownProps extends tooltipProps {
  type?: buttonType
  size?: buttonSize
  items?: dropdownItemProps[]
  hideOnClick?: boolean
  splitButton?: boolean
}

export interface dropdownEmits {
  (e: 'visible-change', value: MouseEvent): void
  (e: 'command', value: MouseEvent): void
  (e: 'click', value: MouseEvent): void
}

export interface dropdownInstance {
  open(): void
  close(): void
}

export interface dropdownContext {
  handleItemClick(item: dropdownProps): void
  size: ComputedRef<buttonSize | void>
}
