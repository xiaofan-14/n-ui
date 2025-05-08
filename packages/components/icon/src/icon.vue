<script setup lang="ts">
import type {iconProps} from './icon.ts'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {omit} from 'lodash-es'
import {computed} from "vue";

defineOptions({
  name: 'ErIcon',
  inheritAttrs: false,
})
const props = defineProps<iconProps>()

const filterProps = computed(() => {
  return omit(props, ['type', 'color'])
})
const customStyle = computed(() => ({
  color: props.color ?? void 0
}))
</script>

<template>
  <i
      class="er-icon"
      :class="[`er-icon-${props.type}`]"
      :style="customStyle"
      v-bind="$attrs"
  >
    <FontAwesomeIcon v-bind="filterProps"/>
  </i>
</template>

<style>
@import '../style/style.css';
</style>