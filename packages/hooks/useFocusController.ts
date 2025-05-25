import { isFunction } from 'lodash-es'
import { getCurrentInstance, ref } from 'vue'
import type { Ref } from 'vue'
import useEventListener from './useEventListener'

interface useFocusControllerOptions {
  afterFocus?: () => void
  beforeBlur?: (e: FocusEvent) => boolean | void
  afterBlur?: () => void
}

export default function useFocusController<T extends HTMLElement | { focus(): void }>(
  target: Ref<T | void>,
  { afterBlur, beforeBlur, afterFocus }: useFocusControllerOptions = {} as useFocusControllerOptions
) {
  const instance = getCurrentInstance()!
  const { emit } = instance
  const wrapperRef = ref<HTMLElement>()
  const isFocused = ref(false)

  function handleFocus(event: FocusEvent) {
    if (isFocused.value) return
    isFocused.value = true
    emit('focus', event)
    afterFocus?.()
  }

  function handleBlur(event: FocusEvent) {
    const cancelBlur = isFunction(beforeBlur) ? beforeBlur(event) : false
    if (cancelBlur || (event.relatedTarget && wrapperRef.value?.contains(event.relatedTarget as Node)))
      return

    isFocused.value = false
    emit('blur', event)
    afterBlur?.()
  }

  function handleClick() {
    target.value?.focus()
  }

  useEventListener(wrapperRef, 'click', handleClick)

  return {
    wrapperRef,
    isFocused,
    handleFocus,
    handleBlur
  }
}
