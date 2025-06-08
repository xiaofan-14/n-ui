<script setup lang="ts">
import {
  useFocusController
} from '@n-ui/hooks'
import {
  ref,
  computed,
  watch,
  useAttrs,
  shallowRef,
  nextTick
} from 'vue'
import { NIcon } from '../../icon'
import { each, noop } from 'lodash-es'
import {
  useFormItem,
  useFormDisabled,
  useFormItemInputId
} from '../../form'
import type {
  InputProps,
  InputEmits,
  InputInstance
} from './input'

defineOptions({
  name: 'NInput',
  inheritAttrs: false
})

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off'
})

const emits = defineEmits<InputEmits>()

const innerValue = ref(props.modelValue)
const pwdVisible = ref(false)
const isDisabled = useFormDisabled()

const { formItem } = useFormItem()
const { inputId } = useFormItemInputId(props, formItem)

const attrs = useAttrs()

const showClear = computed(() => props.clearable && !!innerValue.value && !isDisabled.value && isFocused.value)
const showPwsArea = computed(() => props.type === 'password' && props.showPassword && !isDisabled.value && !!innerValue.value)

const inputRef = shallowRef<HTMLInputElement>()
const textareaRef = shallowRef<HTMLTextAreaElement>()

const _ref = computed(() => inputRef.value || textareaRef.value)

const { isFocused, wrapperRef, handleBlur, handleFocus } =
useFocusController(_ref, {
  async afterBlur() {
    try {
      await formItem?.validate('blur');
    } catch (_) {
      // 在 input 输入框失焦验证表单时，如果有错误 Async Validation 会抛出异常，暂时不知道怎么解决先丢弃它
    }
  },
})

const clear:InputInstance['clear'] = function(){
  innerValue.value = ''

  each(['input', 'change', 'update:modelValue'], (item: any) => {
    emits(item, innerValue.value)
  })
  emits('clear')
  // 清空表单校验
  formItem?.clearValidate()
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

function togglePwdVisible(){
  pwdVisible.value = !pwdVisible.value
}

watch(()=>props.modelValue,async (val)=>{
  innerValue.value = val
  // 触发表单校验
  try {
   await formItem?.validate('change')
  } catch(_) {}
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
  <div class="n-input" :class="{
    [`n-input--${type}`]: type,
    [`n-input--${size}`]: size,
    'is-disabled': isDisabled,
    'is-prepend': $slots.prepend,
    'is-append': $slots.append,
    'is-prefix': $slots.prefix,
    'is-suffix': $slots.suffix,
    'is-focus': isFocused,
  }">
    <template v-if="type === 'textarea'">
      <textarea class="n-textarea__wrapper" ref="textareaRef" :id="inputId" :disabled="isDisabled" :readonly="readonly"
        :autocomplete="autocomplete" :placeholder="placeholder" :autofocus="autofocus" :form="form" v-model="innerValue"
        v-bind="attrs" @input="handleInput" @change="handleChange" @focus="handleFocus" @blur="handleBlur">
      </textarea>
    </template>
    <template v-else>
      <div v-if="$slots.prepend" class="n-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="n-input__wrapper" ref="wrapperRef">
        <span v-if="$slots.prefix" class="n-input__prefix">
          <slot name="prefix"></slot>
        </span>

        <input class="n-input__inner" ref="inputRef" :id="inputId" :type="showPassword ? (pwdVisible ? 'text' : 'password') : type"
          :disabled="isDisabled" :readonly="readonly" :autocomplete="autocomplete" :placeholder="placeholder"
          :autofocus="autofocus" :form="form" v-model="innerValue" v-bind="attrs" @input="handleInput"
          @change="handleChange" @focus="handleFocus" @blur="handleBlur" />

        <span v-if="$slots.suffix || showClear || showPwsArea" class="n-input__suffix">
          <slot name="suffix"></slot>
          <n-icon icon="xmark" v-if="showClear" class="n-input__clear" @click="clear" @mousedown.prevent="noop" />
          <n-icon icon="eye" v-if="showPwsArea && pwdVisible" class="n-input__password" @click="togglePwdVisible"
            @mousedown.prevent="noop" />
          <n-icon icon="eye-slash" v-if="showPwsArea && !pwdVisible" class="n-input__password"
            @click="togglePwdVisible" @mousedown.prevent="noop" />
        </span>
      </div>

      <div v-if="$slots.append" class="n-input__append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import "../style/style.css";
</style>
