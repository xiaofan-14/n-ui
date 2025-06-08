<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useId } from '@n-ui/hooks'
import type {
  SwitchProps,
  SwitchEmits,
  SwitchInstance
} from './switch'

defineOptions({
  name: 'NSwitch',
  inheritAttrs: false
})

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
})

const emits = defineEmits<SwitchEmits>()
const isDisabled = computed(()=>props.disabled)
const inputId = useId().value

const innerValue = ref(props.modelValue)
const inputRef = ref<HTMLInputElement>()
const checked = computed(()=>innerValue.value === props.activeValue)
const focus: SwitchInstance['focus'] = function(){
  inputRef.value?.focus()
}

function handleChange(){
  // 禁用状态
  if(isDisabled.value) return

  const newVal = checked.value ? props.inactiveValue : props.activeValue
  innerValue.value = newVal

  emits('update:modelValue', newVal)
  emits('change', newVal)
}

onMounted(()=>{
  inputRef.value!.checked = checked.value
})

watch(checked, (val)=>{
  inputRef.value!.checked = val
})

defineExpose<SwitchInstance>({
  checked,
  focus
})
</script>

<template>
  <div
    class="n-switch"
    :class="{
      [`n-switch--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': checked,
    }"
    @click="handleChange"
  >
    <input
      class="n-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :id="inputId"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      @keydown.enter="handleChange"
    />
    <div class="n-switch__core">
      <div class="n-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="n-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="n-switch__core-action"></div>
    </div>
  </div>
</template>

<style scoped>
@import '../style/style.css';
</style>
