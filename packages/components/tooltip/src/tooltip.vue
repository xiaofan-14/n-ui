<script setup lang="ts">
import type {Ref} from 'vue'
import type {DebouncedFunc} from 'lodash-es'
import type {Instance} from '@popperjs/core'
import type {buttonInstance} from "../../button"
import type {
  tooltipProps,
  tooltipEmits,
  tooltipInstance
} from './tooltip'
import {
  computed,
  onUnmounted,
  ref,
  watch,
  watchEffect
} from 'vue'
import {bind, debounce} from 'lodash-es'
import {createPopper} from '@popperjs/core'
import {useClickOutSide} from '@learn-ui-to-me/hooks'
import {useEventToTriggerNode} from "./useEventToTriggerNode"

interface _tooltipProps extends tooltipProps {
  virtualRef?: HTMLElement | buttonInstance | void
  virtualTriggering?: boolean
}

defineOptions({
  name: 'ErTooltip'
})

const props = withDefaults(defineProps<_tooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  showTimeout: 0,
  hideTimeout: 200
})
const emits = defineEmits<tooltipEmits>()

const visible = ref(false)

const containerNode = ref<HTMLElement>()
const _triggerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()

const events: Ref<Record<string, EventListener>> = ref({})
const outerEvents: Ref<Record<string, EventListener>> = ref({})
const dropdownEvents: Ref<Record<string, EventListener>> = ref({})

const popperOptions = computed(() => ({
  placement: props.placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }
    }
  ],
  ...props.popperOptions
}))

const openDelay = computed(() => props.trigger === 'hover' ? props.showTimeout : 0)
const closeDelay = computed(() => props.trigger === 'hover' ? props.hideTimeout : 0)
const triggerNode = computed(() => {
  if (props.virtualTriggering) {
    return (
      ((props.virtualRef as buttonInstance)?.ref as any) ??
      (props.virtualRef as HTMLElement) ?? _triggerNode.value
    )
  }
  return _triggerNode.value as HTMLElement
})

const show: tooltipInstance['show'] = openFinal
const hide: tooltipInstance['hide'] = function () {
  openDebounce?.cancel()
  setVisible(false)
}

const triggerStrategyMap: Map<string, () => void> = new Map()
triggerStrategyMap.set('hover', () => {
  events.value['mouseenter'] = openFinal
  outerEvents.value['mouseleave'] = closeFinal
  dropdownEvents.value['mouseenter'] = openFinal
})
triggerStrategyMap.set('click', () => {
  events.value['click'] = togglePopper
})
triggerStrategyMap.set('contextmenu', () => {
  events.value['contextmenu'] = (e) => {
    e.preventDefault()
    openFinal()
  }
})

let openDebounce: DebouncedFunc<() => void> | null
let closeDebounce: DebouncedFunc<() => void> | null

let popperInstance: null | Instance

function destroyPopperInstance() {
  popperInstance?.destroy()
  popperInstance = null
}

function openFinal() {
  closeDebounce?.cancel()
  openDebounce?.()
}

function closeFinal() {
  openDebounce?.cancel()
  closeDebounce?.()
}

function togglePopper() {
  visible.value ? closeFinal() : openFinal()
}

function setVisible(val: boolean) {
  if (props.disabled) return
  visible.value = val
  emits('visible-change', val)
}

function attachEvents() {
  if (props.disabled || props.manual) return
  triggerStrategyMap.get(props.trigger)?.()
}

function resetEvents() {
  events.value = {}
  outerEvents.value = {}
  dropdownEvents.value = {}

  attachEvents()
}

if (!props.manual) {
  attachEvents()
}

watchEffect(() => {
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value)
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})

useClickOutSide(containerNode, () => {
  emits('click-outside')
  if (props.trigger === 'hover' || props.manual) return
  visible.value && closeFinal()
})

watch(visible, (val) => {
  if (!val) return
  if (triggerNode.value && popperNode.value) {
    popperInstance = createPopper(
      triggerNode.value,
      popperNode.value,
      popperOptions.value
    )
  }
}, {flush: 'post'})

watch(() => props.manual, (isManual) => {
  if (isManual) {
    events.value = {}
    outerEvents.value = {}
    dropdownEvents.value = {}
    return
  }
  attachEvents()
})

watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger === oldTrigger) return
  resetEvents()
})

watch(() => props.disabled, (val, oldValue) => {
  if (val === oldValue) return
  openDebounce?.cancel()
  visible.value = false
  emits('visible-change', false)
  resetEvents()
})

useEventToTriggerNode(props, triggerNode, events, () => {
  openDebounce?.cancel()
  setVisible(false)
})

onUnmounted(() => {
  destroyPopperInstance()
})

defineExpose<tooltipInstance>({
  show,
  hide
})

</script>

<template>
  <div class="er-tooltip" ref="containerNode" v-on="outerEvents">
    <div
      class="er-tooltip__trigger"
      ref="_triggerNode"
      v-on="events"
      v-if="!virtualTriggering">
      <slot></slot>
    </div>
    <slot name="default" v-else></slot>

    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div class="er-tooltip__popper" ref="popperNode" v-on="dropdownEvents" v-if="visible">
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>

</template>

<style scoped>
@import '../style/style.css';
</style>
