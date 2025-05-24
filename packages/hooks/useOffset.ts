import { computed } from 'vue'
import type { Ref } from 'vue'

interface useOffsetOptions {
  offset: number,
  boxHeight: Ref<number>,
  getLastBottomOffset(): number
}

interface useOffsetResult {
  topOffset: Ref<number>
  bottomOffset: Ref<number>
}

export default function useOffset(opts: useOffsetOptions): useOffsetResult {
  const lastBottomOffset = computed(() => opts.getLastBottomOffset())

  const topOffset = computed(() => opts.offset + lastBottomOffset.value)

  const bottomOffset = computed(() => topOffset.value + opts.boxHeight.value)

  return {
    topOffset,
    bottomOffset
  }
}
