import type { Ref } from 'vue'
import { computed } from 'vue'

const defaultIDInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0
}

export function useId(namespace: string = 'er'): Ref<string> {
  const idRef = computed(() => {
    return `${namespace}-${defaultIDInjection.prefix}-${defaultIDInjection.current++}`
  })
  return idRef
}

export default useId
