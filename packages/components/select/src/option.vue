<script setup lang="ts">
import { renderVNode } from '@n-ui/utils'
import { computed, inject } from 'vue'
import { eq, every,get } from 'lodash-es'
import { SELECT_CTX_KEY } from './constants'
import type { SelectOptionProps } from './select'

defineOptions({
  name: 'NOption'
})

const props = withDefaults(defineProps<SelectOptionProps>(), {
  disabled: false
})

const ctx = inject(SELECT_CTX_KEY)

const selected = computed(()=>
  ctx?.selectStates.selectedOption?.value === props.value
)

const isHighlighted = computed(()=>
  every(['label','value'], key => {
    eq(get(ctx, ['highlightedLine','value', key]), get(props, key))
  })
)

function handleClick(){
  if(props.disabled) return
  ctx?.handleSelect(props)
}
</script>

<template>
  <li
  class="n-select__menu-item"
  :class="{
    'is-disabled': disabled,
    'is-selected': selected,
    'is-highlighted': isHighlighted
  }"
  :id="`select-item-${value}`"
  @click.stop="handleClick"
  >
    <slot>
      <render-v-node :v-node="ctx?.renderLabel ? ctx?.renderLabel(props) : label" />
    </slot>
  </li>
</template>

<style scoped>
@import "../style/style.css";
</style>
