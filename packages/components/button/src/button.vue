<script setup lang="ts">
import type {ButtonProps, ButtonInstance, ButtonEmits} from './button.ts'
import {computed} from "vue"
import {throttle} from 'lodash-es'
import {NIcon} from '../../icon'
import {useButton} from "./useButton.ts"
import {useButtonCustomStyle} from "./useButtonCustom"
import loading from "../../loading";

defineOptions({name: 'NButton'})

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 500,
})

const emits = defineEmits<ButtonEmits>()

const {
  _size,
  _type,
  _disabled,
  _ref,
  slots,
  handleClick
} = useButton(props, emits as ButtonEmits)

const { buttonKls } = useButtonCustomStyle(
  _type,
  _size,
  _disabled,
  props
)

function handleBtnClick(evt: MouseEvent) {
  handleClick(evt)
}

const handleBtnClickThrottle = throttle(
  handleClick,
  props.throttleDuration,
  {trailing: false}
)

const iconStyle = computed(() => {
  const marginValue = slots.default ? '6px' : '0px'
  return {
    ...(props.icon && {marginRight: marginValue}),
    ...(props.suffixIcon && {marginLeft: marginValue})
  }
})

defineExpose<ButtonInstance>({
  ref: _ref,
  disabled: _disabled,
  size: _size,
  type: _type
})
</script>

<template>
  <component
    :id="props.id"
    ref="_ref"
    :is="tag"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="buttonKls"
    @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
  >
    <template v-if="loading">
      <slot name="loading">
        <n-icon class="loading-icon" :icon="loadingIcon ?? 'spinner'" spin :style="iconStyle" size="1x"/>
      </slot>
    </template>

    <n-icon v-if="icon && !loading" :icon="icon" size="1x" :style="iconStyle"/>
    <slot></slot>
    <n-icon v-if="suffixIcon && !loading" :icon="suffixIcon" size="1x" :style="iconStyle"/>
  </component>
</template>
<style>
@import "../style/style.css";
</style>
