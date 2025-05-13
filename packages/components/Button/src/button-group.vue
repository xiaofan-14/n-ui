<script setup lang="ts">
import type {buttonGroupProps} from "./button.ts"
import {provide, reactive, toRef} from 'vue'
import {BUTTON_GROUP_CTX} from "./contants.ts"

defineOptions({
  name: 'ErButtonGroup'
})

const props = defineProps<buttonGroupProps>()
provide(
    BUTTON_GROUP_CTX,
    reactive({
      size: toRef(props, 'size'),
      type: toRef(props, 'type'),
      disable: toRef(props,'disabled')
    })
)
</script>

<template>
  <div class="er-button-group">
    <slot></slot>
  </div>
</template>

<style>
@import '../style/style.css';
</style>