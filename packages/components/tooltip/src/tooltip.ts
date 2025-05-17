import type {Placement, Options} from '@popperjs/core'

export interface tooltipProps {
  content?: string
  trigger?: 'hover' | 'click' | 'contextmenu'
  placement?: Placement
  manual?: boolean
  disabled?: boolean
  popperOptions?: Partial<Options>
  transition?: string
  showTimeout?: number
  hideTimeout?: number
}

export interface tooltipEmits {
  (e: 'visible-change', value: boolean): void,

  (e: 'click-outside'): void
}

export interface tooltipInstance {
  show(): void,

  hide(): void,
}
