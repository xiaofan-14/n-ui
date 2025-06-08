<script setup lang="ts">
import { inject, computed } from 'vue';
import { DROPDOWN_CTX_KEY } from './constants'
import { useId } from '@n-ui/hooks'
import type { dropdownItemProps } from './dropdown'

defineOptions({
  name: 'NDropdownItem'
})

const props = withDefaults(defineProps<dropdownItemProps>(), {
  disabled: false,
  divided: false,
  command: useId().value
})

const ctx = inject(DROPDOWN_CTX_KEY)
const size = computed(() => ctx?.size.value)

function handleClick() {
  if (props.disabled) return
  ctx?.handleItemClick(props)
}
</script>

<template>
  <li v-if="divided" role="separator" class="divided-placeholde"></li>
  <li :id="`dropdown-item-${command ?? useId().value}`" :class="{
    'n-dropdown__item': true,
    ['n-dropdown__item--' + size]: size,
    'is-disabled': disabled,
    'is-divided': divided
  }" @click="handleClick">
    <slot>
      {{ label }}
    </slot>
  </li>
</template>

<style scoped>
@import '../style/style.css';
</style>
