<script setup lang="ts">
import {computed, ref, reactive, provide, watch, nextTick} from 'vue'
import {useId, useFocusController, useClickOutSide} from '@learn-ui-to-me/hooks'
import {each, eq, filter, find, get, size, noop, isFunction} from 'lodash-es'
import type {VNode, Ref} from 'vue'
import type {
  SelectContext,
  SelectEmits,
  SelectInstance,
  SelectOptionProps,
  SelectProps,
  SelectStates
} from "./select.ts"
import type {tooltipInstance} from '../../tooltip'
import type {InputInstance} from '../../input'

import ErOption from './option.vue'
import {ErTooltip} from '../../tooltip'
import {ErInput} from '../../input'
import {ErIcon} from '../../icon'

import {SELECT_CTX_KEY} from './constants.ts'

defineOptions({name: 'ErSelect'})

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '1',
  options: () => []
})

const emits = defineEmits<SelectEmits>()
const slots = defineSlots()

const initialOption = findOption(props.modelValue)

const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? '',
  selectedOption: initialOption,
  highlightedIndex: -1,
  mouseHover: false,
  loading: false,
})

const inputId = useId().value
const selectRef = ref<HTMLElement>()
const tooltipRef = ref<tooltipInstance>()
const inputRef = ref<InputInstance>()
const filterChild: Ref<Map<VNode, SelectOptionProps>> = ref(new Map())

const isDropdownVisible = ref(false)

const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleFocus,
  handleBlur
} = useFocusController(inputRef)

useClickOutSide(selectRef, (e) => handleClickOutSide(e))

const isDisabled = computed(() => props.disabled)
const children = computed(() => filter(slots?.defalut?.(), (child) => eq(child.type, ErOption)))

const hasChildren = computed(() => size(children.value) > 0)

const showClear = computed(() =>
  props.clearable && selectStates.mouseHover && selectStates.inputValue !== ''
)

const highlightedLine = computed(() => {
  let result: SelectOptionProps | void
  if (hasChildren.value) {
    const node = [...filterChild.value][selectStates.highlightedIndex]?.[0]
    result = filterChild.value.get(node)
  } else {
    result = props.options[selectStates.highlightedIndex]
  }
  return result
})

const focus: SelectInstance['focus'] = function () {
  inputRef.value?.focus()
}

const blur: SelectInstance['blur'] = function () {
  handleClickOutSide()
}

function handleClickOutSide(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent('foucs', e)))
  }
}

function handleClear() {
  inputRef.value?.clear()
  selectStates.inputValue = ''
  selectStates.selectedOption = null

  emits('clear')
  each(['change', 'update:modelValue'], k => emits(k as any, ''))
}

function findOption(value: string) {
  return find(props.options, opt => opt.value === value)
}

function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return
  get(tooltipRef.value, ['value', visible ? 'show' : 'hide'])?.()
  isDropdownVisible.value = visible
  emits('visible-change', visible)
  selectStates.highlightedIndex = -1
}

function toggleVisible() {
  if (isDisabled.value) return

  controlVisible(!isDropdownVisible.value)
}

function handleSelect(opt: SelectOptionProps) {
  if (opt.disabled) return

  selectStates.inputValue = opt.label
  selectStates.selectedOption = opt

  each(['change', 'update:modelValue'], k => emits(k as any, opt.value))
  controlVisible(false)
  inputRef.value?.focus()
}

function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt)
  }
  return opt.label
}

function setSelected() {
  const opt = findOption(props.modelValue)
  if (!opt) return
  selectStates.inputValue = opt.label
  selectStates.selectedOption = opt
}

watch(() => props.modelValue, () => {
  // 表单校验
  setSelected()
})

provide<SelectContext>(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine
})

defineExpose<SelectInstance>({
  focus,
  blur
})
</script>

<template>
  <div ref="selectRef" class="er-select" :class="{
    'is-disabled': isDisabled,
  }" @click.stop="toggleVisible" @mouseenter="selectStates.mouseHover = true"
       @mouseleave="selectStates.mouseHover = false">
    <er-tooltip ref="tooltipRef" placement="bottom-start" :popper-options="POPPER_OPTIONS"
                @click-outside="controlVisible(false)" manual>
      <template #default>
        <div ref="inputWrapperRef">
          <er-input ref="inputRef" v-model="selectStates.inputValue" :id="inputId" :disabled="isDisabled"
                    :placeholder="filterable ? filterPlaceholder : placeholder"
                    :readonly="!filterable || !isDropdownVisible"
                    @focus="handleFocus" @blur="handleBlur" @input="handleFilterDebounce" @keydown="handleKeyDown">
            <template #suffix>
              <er-icon v-if="showClear" icon="circle-xmark" class="er-input__clear" @click.stop="handleClear"
                       @mousedown.prevent="noop"/>
              <er-icon v-else class="header-angle" icon="angle-down" :class="{ 'is-active': isDropdownVisible }"/>
            </template>
          </er-input>
        </div>
      </template>
      <template #content>
        <div class="er-select__loading" v-if="selectStates.loading">
          <er-icon icon="spinner" spin/>
        </div>
        <div class="er-select__nodata" v-else-if="filterable && isNoData">
          No data
        </div>
        <ul class="er-select__menu">
          <template v-if="!hasChildren">
            <er-option v-for="item in options" :key="item.value" v-bind="item"/>
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </ul>
      </template>
    </er-tooltip>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
