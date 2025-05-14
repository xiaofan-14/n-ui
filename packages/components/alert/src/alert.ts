export type alertType = 'success' | 'info' | 'warning' | 'danger'

export interface alertProps {
  title?: string
  type?: alertType
  description?: string
  effect?: 'light' | 'dark'
  closable?: boolean
  center?: boolean
  showIcon?: boolean
}

export interface alertEmits {
  (e: 'close'): void
}

export interface alertInstance {
  open(): void
  close(): void
}
