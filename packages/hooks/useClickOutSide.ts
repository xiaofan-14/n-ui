import type {Ref} from 'vue'
import useEventListener from './useEventListener'

export default function useClickOutSide(
  elementRef: Ref<null | HTMLElement>,
  callback: (e: MouseEvent) => void
) {
  useEventListener(document, 'click', (e: Event) => {
    if (!elementRef.value && !e.target) return
    if (!elementRef.value?.contains(e.target as HTMLElement)) callback(e as MouseEvent)
  })
}
