<script setup lang="ts">
import type { tooltipInstance } from '../../tooltip'
import type { popconfirmProps, popconfirmEmits } from './popconfirm'
import { ref, computed } from 'vue'
import { NTooltip } from '../../tooltip'
import { NButton } from '../../button'
import { NIcon } from '../../icon'
import { addUnit } from '@n-ui/utils'
import { useLocale } from '@n-ui/hooks'

defineOptions({
  name: 'NPopconfirm'
})

const props = withDefaults(defineProps<popconfirmProps>(), {
  title: "",
  confirmButtonType: "primary",
  icon: "question-circle",
  iconColor: "#f90",
  hideAfter: 200,
  width: 150,
})
const emits = defineEmits<popconfirmEmits>()
const tooltipRef = ref<tooltipInstance>()

const style = computed(() => ({ width: addUnit(props.width) }))

const locale = useLocale()

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
  <n-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
    <template #content>
      <div class="n-popconfirm" :style="style">
        <div class="n-popconfirm__main">
          <n-icon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
          {{ title }}
        </div>
        <div class="n-popconfirm__action">
          <n-button class="n-popconfirm__cancel" size="small" :type="cancelButtonType" @click="cancel">
            {{ cancelButtonText || locale.t('popconfirm.cancelButtonText') }}
          </n-button>
          <n-button class="n-popconfirm__confirm" size="small" :type="confirmButtonType" @click="confirm">
            {{ confirmButtonText || locale.t('popconfirm.confirmButtonText') }}
          </n-button>
        </div>
      </div>
    </template>

    <template v-if="$slots.default" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="$slots.reference" #default>
      <slot name="reference"></slot>
    </template>
  </n-tooltip>
</template>

<style scoped>
@import '../style/style.css';
</style>
