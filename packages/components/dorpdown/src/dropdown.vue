<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { omit, isNull } from 'lodash-es'
import { ErTooltip } from '../../tooltip'
import { ErButtonGroup, ErButton } from '../../button'
import { DROPDOWN_CTX_KEY } from './constants'
import { useDisabledStyle } from '@learn-ui-to-me/hooks'
import ErDropdownItem from './dropdownItem.vue'
import type {
  dropdownProps,
  dropdownEmits,
  dropdownInstance,
  dropdownContext,
  dropdownItemProps
} from './dropdown'
import type { tooltipInstance } from '../../tooltip'
import type { buttonInstance } from '../../button'


defineOptions({
  name: 'ErDropdown',
  inheritAttrs: false
})

const props = withDefaults(defineProps<dropdownProps>(), {
  hideOnClick: true,
  items: () => [] as dropdownItemProps[]
})

const emits = defineEmits<dropdownEmits>()
const slots = defineSlots()

const tooltipRef = ref<tooltipInstance>()
const triggerRef = ref<buttonInstance | void>(void 0)

const virtualRef = computed(() => triggerRef.value?.ref ?? void 0)
const tooltipProps = computed(() => {
  return omit(props, ['items', 'hideAfterClick', 'size', 'type', 'splitButton'])
})

function handleItemClick(e: dropdownItemProps) {
  props.hideOnClick && tooltipRef.value?.hide()
  isNull(e.command) && emits('command', e.command)
}

!TEST && useDisabledStyle()

provide<dropdownContext>(DROPDOWN_CTX_KEY, {
  handleItemClick,
  size: computed(() => props.size)
})

defineExpose<dropdownInstance>({
  open: () => tooltipRef.value?.show(),
  close: () => tooltipRef.value?.hide()
})
</script>

<template>
  <div class="er-dropdown" :class="{
    'is-disabled': props.disabled
  }">
    <ErTooltip ref="tooltipRef" v-bind="tooltipProps" :virtual-triggering="splitButton" :virtual-ref="virtualRef"
      @:visible-change="$emit('visible-change', $event)">

      <ErButtonGroup v-if="splitButton" :type="type" :size="size" :disabled="disabled">
        <ErButton @click="$emit('click', $event)">
          <slot name="default"></slot>
        </ErButton>
        <ErButton ref="triggerRef" icon="angle-down" />
      </ErButtonGroup>

      <slot name="default" v-else>

      </slot>

      <template #content>
        <div class="er-dropdown__menu">
          <slot name="dropdown">
            <template v-for="item in items" :key="item.command">
              <ErDropdownItem v-bind="item" />
            </template>
          </slot>
        </div>
      </template>

    </ErTooltip>
  </div>
</template>

<style scoped>
@import '../style/style.css';

:deep(.er-button-group) {
  &> :last-child {
    padding: 5px 7px;
  }
}
</style>
