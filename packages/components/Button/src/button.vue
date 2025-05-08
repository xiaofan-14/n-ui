<script setup lang="ts">
import type {buttonProps, buttonInstance} from './button.ts'
import {ref, computed, inject} from "vue"
import {throttle} from 'lodash-es'
import {ErIcon} from '../../icon'
import {BUTTON_GROUP_CTX} from "./contants.ts"

defineOptions({
  name: 'ErButton'
})

const emits = defineEmits<{
  (e: 'click', val: MouseEvent): void
}>()

const props = withDefaults(defineProps<buttonProps>(), {
  tag: 'button',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 500,
})

const slots = defineSlots()
const _ref = ref<HTMLButtonElement>()
const ctx = inject(BUTTON_GROUP_CTX, void 0)

const size = computed(()=> ctx?.size ?? props?.size ?? '' )
const type = computed(()=> ctx?.type ?? props?.type ?? '' )
const disabled = computed(()=> ctx?.disabled || props?.disabled || false )

function handleBtnClick(e: MouseEvent) {
  emits('click', e)
}

const handleBtnClickThrottle = throttle(
    handleBtnClick,
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

defineExpose<buttonInstance>({
  ref: _ref
})
</script>

<template>
  <component
      ref="_ref"
      class="er-button"
      :is="tag" :autofocus="autofocus"
      :type="tag === 'button' ? nativeType : void 0"
      :disabled="disabled || loading ? true : void 0"
      :class="{
      [`er-button--${type}`]: type,
      [`er-button--${size}`]: size,
      'is-loading': loading,
      'is-disabled': disabled,
      'is-plain': plain,
      'is-circle': circle,
      'is-round': round
    }"
      @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)">

    <template v-if="loading">
      <slot name="loading">
        <ErIcon class="loading-icon" :icon="loadingIcon ?? 'spinner'" spin :style="iconStyle" size="1x"/>
      </slot>
    </template>

    <er-icon v-if="icon && !loading" :icon="icon" size="1x" :style="iconStyle"/>
    <slot></slot>
    <er-icon v-if="suffixIcon && !loading" :icon="suffixIcon" size="1x" :style="iconStyle"/>
  </component>
</template>
<style>
@import "../style/style.css";
</style>