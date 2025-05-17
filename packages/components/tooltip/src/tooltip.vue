<script setup lang="ts">
import type {Ref} from 'vue'
import type {DebouncedFunc} from 'lodash-es'
import type {Instance} from '@popperjs/core'
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

defineOptions({
  name: 'ErTooltip'
})

const props = withDefaults(defineProps<tooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  showTimeout: 0,
  hideTimeout: 200
})
const emits = defineEmits<tooltipEmits>()

const visible = ref(false)
const containerNode = ref(null)
const _triggerNode = ref(null)
const virtualTriggering = ref(null)
const popperNode = ref(null)

const events: Ref<Record<string, EventListener>> = ref({})
const outerEvents: Ref<Record<string, EventListener>> = ref({})
const dropdownEvents: Ref<Record<string, EventListener>> = ref({})

const popperOptions = computed(() => ({
  placements: props.placement,
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

const show: tooltipInstance['show'] = openFinal
const hide: tooltipInstance['hide'] = function () {
  openDebounce?.cancel()
  setVisibel(false)
}

let openDebounce: DebouncedFunc<() => void> | null
let closeDebounce: DebouncedFunc<() => void> | null

let popperInstance: null | Instance


function destroyPopperInstance() {
  if (!popperInstance) return
  popperInstance.destroy()
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

}

function toggleVisibel() {
  visible.value ? closeFinal() : openFinal()
}

function setVisibel(val: boolean) {
  if (props.disabled) return
  visible.value = val
  emits('visible-change', val)
}

function attachEvents() {
  if (props.disabled || props.manual) return
  if (props.trigger === 'hover') {
    events.value['mouseenter'] = openFinal
    outerEvents.value['mouseleave'] = closeFinal
    dropdownEvents.value['mouseenter'] = openFinal
    return
  }
  if (props.trigger === 'click') {
    events.value['click'] = togglePopper
    return
  }
  if (props.trigger === 'contextmenu') {
    events.value['contextmenu'] = (e) => {
      e.preventDefault()
      openFinal()
    }
    return
  }
}

function resetEvents() {
  events.value = {}
  outerEvents.value = {}
  dropdownEvents.value = {}

  attachEvents()
}

watchEffect(() => {
  if (!props.manual) {
    attachEvents()
  }
  openDebounce = debounce(bind(setVisibel, null, true), openDelay.value)
  closeDebounce = debounce(bind(setVisibel, null, false), closeDelay.value)
})

useClickOutSide(containerNode, () => {
  emits('click-outside')
  if (props.trigger === 'hover' || props.manual) return
  visible.value && closeFinal()
})

watch(visible, (val) => {
  if (!val) return
  if (_triggerNode.value && popperNode.value) {
    popperInstance = createPopper(
      _triggerNode.value,
      popperNode.value,
      popperOptions.value
    )
  }
}, {flush: 'post'})

watch(() => props.manual, (isManual) => {
  if (isManual) {
    resetEvents()
    return
  }
  attachEvents()
})

watch(() => props.trigger, (val, oldValue) => {
  if (val === oldValue) return
  openDebounce?.cancel()
  emits('visible-change', false)
  resetEvents()
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
