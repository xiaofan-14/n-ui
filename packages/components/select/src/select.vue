<script setup lang="ts">
import {computed, ref, reactive, provide, watch, nextTick, h, onMounted} from 'vue'
import {useId, useFocusController, useClickOutSide} from '@n-ui/hooks'
import {
  each,
  eq,
  filter,
  find,
  get,
  size,
  map,
  noop,
  isFunction,
  assign,
  isNil,
  isBoolean,
  includes,
  debounce
} from 'lodash-es'
import type {VNode} from 'vue'
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

import NOption from './option.vue'
import {NTooltip} from '../../tooltip'
import {NInput} from '../../input'
import {NIcon} from '../../icon'

import {POPPER_OPTIONS, SELECT_CTX_KEY} from './constants.ts'
import {debugWarn, renderVNode} from "@n-ui/utils";
import {useKeyMap} from "./useKeyMap.ts";

const COMPONENT_NAME = 'NSelect'
defineOptions({name: COMPONENT_NAME})

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '1',
  options: () => []
})

const timeout = props.remote ? 300 : 100

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
const filteredChild = ref<Map<VNode, SelectOptionProps>>(new Map())
const filteredOptions = ref(props.options ?? [])
const isDropdownVisible = ref(false)

const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleFocus,
  handleBlur
} = useFocusController(inputRef)

useClickOutSide(selectRef, (e) => handleClickOutSide(e))

const isDisabled = computed(() => props.disabled)
const children = computed(() => filter(slots?.default?.(), (child) => eq(child.type, ErOption)))

const hasChildren = computed(() => size(children.value) > 0)

const showClear = computed(() => props.clearable && selectStates.mouseHover && selectStates.inputValue !== '')

const highlightedLine = computed(() => {
  let result: SelectOptionProps | void
  if (hasChildren.value) {
    const node = [...filteredChild.value][selectStates.highlightedIndex]?.[0]
    result = filteredChild.value.get(node)
  } else {
    result = filteredOptions.value[selectStates.highlightedIndex]
  }
  return result
})

const childrenOptions = computed(() => {
  if (!hasChildren.value) return []
  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled: item.props?.disabled === true || (!isNil(item.props?.disabled) && !isBoolean(item.props?.disabled))
    })
  }))
})

const hasData = computed(() => (hasChildren.value && filteredChild.value.size > 0)
  || (!hasChildren.value && size(filteredOptions.value) > 0))

const isNoData = computed(() => {
  if (!props.filterable) return false
  return !hasData.value;
})

const lastIndex = computed(() => {
  return hasChildren.value ? filteredChild.value.size - 1 : size(filteredOptions.value) - 1
})

const filterPlaceholder = computed(() => {
  return props.filterable &&
  selectStates.selectedOption &&
  isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder
})

const handleFilterDebounce = debounce(handleFilter, timeout)

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

function handleFilter() {
  const seaKey = selectStates.inputValue
  selectStates.highlightedIndex = -1

  if (hasChildren.value) {
    genFilterChilds(seaKey)
    return
  }
  genFilterOptions(seaKey)
}

function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)!(e)
}

function setFilteredChild(opts: typeof childrenOptions.value) {
  filteredChild.value.clear()
  each(opts, item => {
    filteredChild.value.set(item.vNode, item.props as SelectOptionProps)
  })
}

async function genFilterChilds(search: string) {
  if (!props.filterable) return

  if (props.remote && props.remoteMethod && isFunction((props.remoteMethod))) {
    await callRemoteMethod(props.remoteMethod, search)
    setFilteredChild(childrenOptions.value)
    return
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    const opts = map(props.filterMethod(search), 'value')
    setFilteredChild(
      filter(childrenOptions.value, item => {
        return includes(opts, get(item, ['props', 'value']))
      })
    )
    return
  }
  setFilteredChild(
    filter(childrenOptions.value, item => {
      return includes(get(item, ['props', 'label']), search)
    })
  )
}

async function genFilterOptions(search: string) {
  if (!props.filterable) return

  if (props.remote && props.remoteMethod && isFunction((props.remoteMethod))) {
    filteredOptions.value = await callRemoteMethod(props.remoteMethod, search)
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(search)
    return
  }
  // default
  filteredOptions.value = filter(props.options, (opt) => {
    return includes(opt.label, search)
  })
}

async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return

  selectStates.loading = true
  let result
  try {
    result = await method(search)
  } catch (e) {
    debugWarn(e as Error)
    debugWarn(COMPONENT_NAME, 'callRemoteMethod error')
    result = []
    return Promise.reject(e)
  }
  return result
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

  get(tooltipRef, ['value', visible ? 'show' : 'hide'])?.()
  props.filterable && controlInputVal(visible)
  isDropdownVisible.value = visible
  emits('visible-change', visible)
  selectStates.highlightedIndex = -1
}

function controlInputVal(visible: boolean) {
  if (!props.filterable) return

  if (!visible) {
    if (selectStates.selectedOption) selectStates.inputValue = ''
    handleFilterDebounce()
    return
  }
  selectStates.inputValue = selectStates.selectedOption?.label || ''
}

function toggleVisible() {
  if (isDisabled.value)  return
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

const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex
})

watch(() => props.modelValue, () => {
  // 表单校验
  setSelected()
})

watch(() => props.options, (newVal) => {
  filteredOptions.value = newVal ?? []
})

watch(() => childrenOptions.value, (newVal) => setFilteredChild(newVal), {immediate: true})

onMounted(() => {
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
  <div ref="selectRef" class="n-select" :class="{
    'is-disabled': isDisabled,
  }" @click.stop="toggleVisible" @mouseenter="selectStates.mouseHover = true"
       @mouseleave="selectStates.mouseHover = false">
    <n-tooltip ref="tooltipRef" placement="bottom-start" :popper-options="POPPER_OPTIONS"
                @click-outside="controlVisible(false)" manual>
      <template #default>
        <div ref="inputWrapperRef">
          <n-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus" @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeyDown"
          >
            <template #suffix>
              <n-icon v-if="showClear" icon="circle-xmark" class="n-input__clear" @click.stop="handleClear"
                       @mousedown.prevent="noop"/>
              <n-icon v-else class="header-angle" icon="angle-down" :class="{ 'is-active': isDropdownVisible }"/>
            </template>
          </n-input>
        </div>
      </template>
      <template #content>
        <div class="n-select__loading" v-if="selectStates.loading">
          <n-icon icon="spinner" spin/>
        </div>
        <div class="n-select__nodata" v-else-if="filterable && isNoData">
          No data
        </div>
        <ul class="n-select__menu">
          <template v-if="!hasChildren">
            <n-option v-for="item in filteredOptions" :key="item.value" v-bind="item"/>
          </template>
          <template v-else>
            <template v-for="[vNode, _props] in filteredChild" :key="_props.value">
              <render-v-node :v-node="vNode"/>
            </template>
          </template>
        </ul>
      </template>
    </n-tooltip>
  </div>
</template>

<style scoped>
@import "../style/style.css";
</style>
