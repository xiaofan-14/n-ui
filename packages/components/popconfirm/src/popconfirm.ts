import type { buttonType } from '../../button'

export interface popconfirmProps {
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonType?: buttonType
  cancelButtonType?: buttonType
  icon?: string
  iconColor?: string
  hideIcon?: boolean
  hideAfter?: number
  width?: string | number
}

export interface popconfirmEmits {
  (e: 'confirm', value: MouseEvent): void,

  (e: 'cancel', value: MouseEvent): void
}
