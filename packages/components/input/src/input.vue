<script setup lang="ts">
import {
  useId,
   useFocusController
  } from '@learn-ui-to-me/hooks'
import {
  ref,
  computed,
  watch,
  useAttrs,
  shallowRef,
  nextTick
} from 'vue'
import type {
  InputProps,
  InputEmits,
  InputInstance
} from './input'
import { ErIcon } from '../../icon'
import { each, noop } from 'lodash-es'

defineOptions({
  name: 'ErInput',
  inheritAttrs: false
})

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off'
})


const emits = defineEmits<InputEmits>()

const innerValue = ref(props.modelValue)
const pwdVisiable = ref(false)

const isDisabled = computed(() => props.disabled)

const attrs = useAttrs()

const showClear = computed(() => props.clearable && !!innerValue.value && !isDisabled.value && isFocused.value)
const showPwsArea = computed(() => props.type === 'password' && props.showPassword && !isDisabled && !!innerValue.value)

const inputRef = shallowRef<HTMLInputElement>()
const textareaRef = shallowRef<HTMLTextAreaElement>()

const _ref = computed(() => inputRef.value || textareaRef.value)

const { isFocused, wrapperRef, handleBlur, handleFocus } = useFocusController(_ref, {
  afterBlur() {

  },
})

const clear:InputInstance['clear'] = function(){
  innerValue.value = ''

  each(['input', 'change', 'update:modelValue'], (item: any) => {
    emits(item, innerValue.value)
  })
  emits('clear')
  // 清空表单校验
  // ...
}
const focus:InputInstance['focus'] = async function(){
  await nextTick()
  _ref.value?.focus()
}
const blur:InputInstance['blur'] = async function(){
  _ref.value?.blur()
}
const select:InputInstance['select'] = async function(){
  _ref.value?.select()
}

function handleInput(){
  emits('input', innerValue.value)
  emits('update:modelValue', innerValue.value)
}

function handleChange(){
  emits('change', innerValue.value)
}

function togglePwdVisiable(){
  pwdVisiable.value = !pwdVisiable.value
}

watch(()=>props.modelValue,(val)=>{
  innerValue.value = val
  // 触发表单校验
})

defineExpose<InputInstance>({
  ref: _ref,
  clear,
  focus,
  blur,
  select
})
</script>

<template>
  <div class="er-input" :class="{
    [`er-input--${type}`]: type,
    [`er-input--${size}`]: size,
    'is-disabled': isDisabled,
    'is-prepend': $slots.prepend,
    'is-append': $slots.append,
    'is-prefix': $slots.prefix,
    'is-suffix': $slots.suffix,
    'is-focus': isFocused,
  }">
    <template v-if="type === 'textarea'">
      <textarea class="er-textarea__wrapper" ref="textareaRef" :id="useId().value" :disabled="isDisabled" :readonly="readonly"
        :autocomplete="autocomplete" :placeholder="placeholder" :autofocus="autofocus" :form="form" v-model="innerValue"
        v-bind="attrs" @input="handleInput" @change="handleChange" @focus="handleFocus" @blur="handleBlur">
      </textarea>
    </template>
    <template v-else>
      <div v-if="$slots.prepend" class="er-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="er-input__wrapper" ref="wrapperRef">
        <span v-if="$slots.prefix" class="er-input__prefix">
          <slot name="prefix"></slot>
        </span>

        <input class="er-input__inner" ref="inputRef" :id="useId().value" :type="showPassword ? (pwdVisiable ? 'text' : 'password') : type"
          :disabled="isDisabled" :readonly="readonly" :autocomplete="autocomplete" :placeholder="placeholder"
          :autofocus="autofocus" :form="form" v-model="innerValue" v-bind="attrs" @input="handleInput"
          @change="handleChange" @focus="handleFocus" @blur="handleBlur" />

        <span v-if="$slots.suffix || showClear || showPwsArea" class="er-input__suffix">
          <slot name="suffix"></slot>
          <er-icon icon="xmark" v-if="showClear" class="er-input__clear" @click="clear" @mousedown.prevent="noop" />
          <er-icon icon="eye" v-if="showPwsArea && pwdVisiable" class="er-input__password" @click="togglePwdVisiable"
            @mousedown.prevent="noop" />
          <er-icon icon="eye-slash" v-if="showPwsArea && !pwdVisiable" class="er-input__password"
            @click="togglePwdVisiable" @mousedown.prevent="noop" />
        </span>
      </div>

      <div v-if="$slots.append" class="er-input__append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import "../style/style.css";
</style>
