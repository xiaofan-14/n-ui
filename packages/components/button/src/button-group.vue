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
    disabled: toRef(props, 'disabled')
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

.er-button-group {
  display: inline-block;
  vertical-align: middle;
}

.er-button-group::after {
  clear: both;
}

/* 作用域穿透 */
.er-button-group > .er-button {
  float: left;
  position: relative;
  margin-left: 0;
}

/* 第一个按钮 */
.er-button-group > .er-button:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right-color: var(--er-button-group-border-color);
}

/* 最后一个按钮 */
.er-button-group > .er-button:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left-color: var(--er-button-group-border-color);
}

/* 中间按钮（非第一个也非最后一个） */
.er-button-group > .er-button:not(:first-child):not(:last-child) {
  border-radius: 0;
  border-left-color: var(--er-button-group-border-color);
  border-right-color: var(--er-button-group-border-color);
}

/* 除了最后一个按钮的 margin-right 调整 */
.er-button-group > .er-button:not(:last-child) {
  margin-right: -1px;
}

/* 只有一个按钮的情况 */
.er-button-group > .er-button:first-child:last-child {
  border-top-right-radius: var(--er-border-radius-base);
  border-bottom-right-radius: var(--er-border-radius-base);
  border-top-left-radius: var(--er-border-radius-base);
  border-bottom-left-radius: var(--er-border-radius-base);
}

/* 圆角按钮 */
.er-button-group > .er-button:first-child:last-child.is-round {
  border-radius: var(--er-border-radius-round);
}

/* 圆形按钮 */
.er-button-group > .er-button:first-child:last-child.is-circle {
  border-radius: 50%;
}
</style>
