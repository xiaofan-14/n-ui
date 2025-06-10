<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { omit, isNil } from 'lodash-es'
import { NTooltip } from '../../tooltip'
import { NButtonGroup, NButton } from '../../button'
import { DROPDOWN_CTX_KEY } from './constants'
import { useDisabledStyle } from '@n-ui/hooks'
import NDropdownItem from './dropdownItem.vue'
import type {
  dropdownProps,
  dropdownEmits,
  dropdownInstance,
  dropdownContext,
  dropdownItemProps
} from './dropdown'
import type { tooltipInstance } from '../../tooltip'
import type { ButtonInstance } from '../../button'


defineOptions({
  name: 'NDropdown',
  inheritAttrs: false
})

const props = withDefaults(defineProps<dropdownProps>(), {
  hideOnClick: true,
  items: () => [] as dropdownItemProps[]
})

const emits = defineEmits<dropdownEmits>()
const slots = defineSlots()

const tooltipRef = ref<tooltipInstance>()
const triggerRef = ref<ButtonInstance | void>(void 0)

const virtualRef = computed(() => triggerRef.value?.ref ?? void 0)
const tooltipProps = computed(() => {
  return omit(props, ['items', 'hideAfterClick', 'size', 'type', 'splitButton'])
})

function handleItemClick(e: dropdownItemProps) {
  props.hideOnClick && tooltipRef.value?.hide()
  !isNil(e.command) && emits('command', e.command)
}

// @ts-ignore
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
  <div class="n-dropdown" :class="{
    'is-disabled': props.disabled
  }">

    <n-tooltip ref="tooltipRef" v-bind="tooltipProps" :virtual-triggering="splitButton" :virtual-ref="virtualRef"
      @:visible-change="$emit('visible-change', $event)">

      <n-button-group v-if="splitButton" :type="type" :size="size" :disabled="disabled">
        <n-button @click="$emit('click', $event)">
          <slot name="default"></slot>
        </n-Button>
        <n-button ref="triggerRef" icon="angle-down" />
      </n-button-group>

      <!-- <template v-else> -->
        <slot v-else name="default"></slot>
      <!-- </template> -->

      <template #content>
        <div class="n-dropdown__menu">
          <slot name="dropdown">
            <template v-for="item in items" :key="item.command">
              <n-dropdown-item v-bind="item" />
            </template>
          </slot>
        </div>
      </template>

    </n-tooltip>
  </div>
</template>

<style scoped>
@import '../style/style.css';

:deep(.n-button-group) {
  &> :last-child {
    padding: 5px 7px;
  }
}
</style>
