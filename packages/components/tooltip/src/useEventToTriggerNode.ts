import type {tooltipProps} from "./tooltip"
import type {Ref, ComputedRef, WatchStopHandle} from "vue"
import {each, isElement} from "lodash-es"
import {onMounted, onUnmounted, watch} from "vue"

/**
 *
 * @param props
 * @param triggerNode
 * @param events
 * @param closeMethod
 */
export function useEventToTriggerNode(
  props: tooltipProps & { virtualTriggering?: boolean },
  triggerNode: ComputedRef<HTMLElement | null>,
  events: Ref<Record<string, EventListener>>,
  closeMethod: () => void
) {
  let watchEventStopHandle: WatchStopHandle | void
  let watchTriggerNodeStopHandle: WatchStopHandle | void

  const _eventHandleMap = new Map()

  const _bindEventToVirtualTriggerNode = () => {
    const el = triggerNode.value
    isElement(el) &&
    each(events.value, (fn, event) => {
      _eventHandleMap.set(event, fn)
      el?.addEventListener(event as keyof HTMLElementEventMap, fn)
    })
  }

  const _unbindEventToVirtualTriggerNode = () => {
    const el = triggerNode.value
    isElement(el) &&
    each(['mouseenter', 'click', 'contextmenu'], (key) => {
      _eventHandleMap.has(key) && el?.removeEventListener(key, _eventHandleMap.get(key))
    })
  }

  onMounted(() => {
    watchTriggerNodeStopHandle = watch(triggerNode, () => {
      props.virtualTriggering && _bindEventToVirtualTriggerNode()
    }, {immediate: true})

    watchEventStopHandle = watch(events, () => {
      if (!props.virtualTriggering) return
      _unbindEventToVirtualTriggerNode()
      _bindEventToVirtualTriggerNode()
      closeMethod()
    }, {deep: true})
  })
  onUnmounted(() => {
    watchTriggerNodeStopHandle && watchTriggerNodeStopHandle()
    watchEventStopHandle && watchEventStopHandle()
  })
}
