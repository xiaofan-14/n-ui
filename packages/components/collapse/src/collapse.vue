<script setup lang="ts">
import type { collapseEmits, collapseItemName, collapseProps } from './collapse'
import {provide, ref, watch, watchEffect} from 'vue'
import { COLLAPSE_CTX_KEY } from './contants'
import { debugWarn } from '@learn-ui-to-me/utils'

const COMPONENT_NAME = 'Collapse'

defineOptions({
    name: COMPONENT_NAME,
})


const props = defineProps<collapseProps>()
const emits = defineEmits<collapseEmits>()
const activeNames = ref(props.modelValue!)

function handleItemClick(item: collapseItemName) {
  let _activeName = [...activeNames.value]

  /**
   * 如果是手风琴模式
   */
  if(props.accordion){
    _activeName = [_activeName[0] === item ? '' : item]
    updateActiveNames(_activeName)
    return
  }

  const index = _activeName.indexOf(item)
  if(index > -1){
    _activeName.splice(index, 1)
  }else{
    _activeName.push(item)
  }
  updateActiveNames(_activeName)
}

function updateActiveNames(value: collapseItemName[]) {
    activeNames.value = value
    emits('update:modelValue', value)
    emits('change', value)
}

watchEffect(()=>{
  if(props.accordion && activeNames.value.length > 1){
    debugWarn(COMPONENT_NAME,'accordion mode should only have one active item')
  }
})

watch(() => props.modelValue, (newName) => {
  if (JSON.stringify(newName) !== JSON.stringify(activeNames.value)) {
    updateActiveNames(newName!)
  }
})

provide(COLLAPSE_CTX_KEY, {
    activeNames,
    handleItemClick,
})
</script>

<template>
    <div class="er-collapse">
        <slot></slot>
    </div>
</template>

<style>
@import '../style/style.css';
</style>