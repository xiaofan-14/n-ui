<script setup lang="ts">
import {NIcon} from '../../icon'
import {useButton} from "./useButton"
import {useButtonCustomStyle} from "./useButtonCustom"
import {throttle} from "lodash-es"
import type {ButtonProps, ButtonInstance, ButtonEmits} from './button'

defineOptions({name: 'NButton'})

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  type: 'primary',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 300,
})

const emits = defineEmits<ButtonEmits>()

const {
  _size,
  _type,
  _disabled,
  _ref,
  _props,
  slots,
  handleClick
} = useButton(props, emits)

const {buttonKls, iconStyle} = useButtonCustomStyle(_type, _size, _disabled, props, slots)

function handleBtnClick(evt: MouseEvent) {
  handleClick(evt)
}

const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration, {trailing: false})

defineExpose<ButtonInstance>({
  ref: _ref,
  disabled: _disabled,
  size: _size,
  type: _type
})
</script>

<template>
  <component
    :is="tag"
    ref="_ref"
    v-bind="_props"
    :class="buttonKls"
    @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
  >

    <!--  only loading -->
    <template v-if="loading">
      <slot name="loading">
        <n-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          spin
          :style="iconStyle"
          size="1x"
        />
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
