<script setup lang="ts">
import type { tooltipInstance } from '../../tooltip'
import type { popconfirmProps, popconfirmEmits } from './popconfirm'
import { ref, computed } from 'vue'
import { ErTooltip } from '../../tooltip'
import { ErButton } from '../../button'
import { ErIcon } from '../../icon'
import { addUnit } from '@learn-ui-to-me/utils'

defineOptions({
  name: 'ErPopconfirm'
})

const props = withDefaults(defineProps<popconfirmProps>(), {
  title: "",
  confirmButtonType: "primary",
  cancelButtonText: "No",
  confirmButtonText: "Yes",
  icon: "question-circle",
  iconColor: "#f90",
  hideAfter: 200,
  width: 150,
})
const emits = defineEmits<popconfirmEmits>()
const tooltipRef = ref<tooltipInstance>()


const style = computed(() => ({ width: addUnit(props.width) }))

function hidePopper() {
  tooltipRef.value?.hide()
}

function confirm(e: MouseEvent) {
  emits('confirm', e)
  hidePopper()
}

function cancel(e: MouseEvent) {
  emits('cancel', e)
  hidePopper()
}

defineExpose({
  confirm,
  cancel
})
</script>

<template>
  <er-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
    <template #content>
      <div class="er-popconfirm" :style="style">
        <div class="er-popconfirm__main">
          <er-icon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
          {{ title }}
        </div>
        <div class="er-popconfirm__action">
          <er-button class="er_popconfirm__cancel" size="small" :type="cancelButtonType" @click="cancel">
            {{ cancelButtonText }}
          </er-button>
          <er-button class="er_popconfirm__confirm" size="small" :type="confirmButtonType" @click="confirm">
            {{ confirmButtonText }}
          </er-button>
        </div>
      </div>
    </template>

    <template v-if="$slots.default" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="$slots.reference" #default>
      <slot name="reference"></slot>
    </template>
  </er-tooltip>
</template>

<style scoped>
@import '../style/style.css';
</style>
