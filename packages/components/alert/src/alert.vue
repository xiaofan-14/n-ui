<script setup lang="ts">
import type {alertProps, alertEmits, alertInstance} from './alert'
import {ref, computed} from "vue"
import {ErIcon} from '../../icon'
import {typeIconMap} from "@learn-ui-to-me/utils"

defineOptions({
  name: 'ErAlert'
})

const props = withDefaults(defineProps<alertProps>(), {
  effect: 'light',
  type: 'info',
  closable: true
})

const emits = defineEmits<alertEmits>()
const slots = defineSlots()
const visible = ref(true)

const iconName = computed(() => {
  return typeIconMap.get(props.type) ?? 'circle-info'
})

const withDescription = computed(() => {
  return props.description || slots.default
})

function close() {
  visible.value = false
  emits('close')
}

function open() {
  visible.value = true
}

defineExpose<alertInstance>({
  close,
  open
})
</script>

<template>
  <transition name="er-alert-fade">
    <div
      v-show="visible"
      class="er-alert"
      role="alert"
      :class="{
      [`er-alert__${type}`]: type,
      [`er-alert__${effect}`]: effect,
      'text-center': center
    }">
      <er-Icon
        v-if="showIcon"
        class="er-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <div class="er-alert__content">
      <span
        class="er-alert__title"
        :class="{ 'with-desc': withDescription}"
        :style="{ display: center && !showIcon ? 'flow' : 'inline'}"
      >
      <slot name="title">{{ title }}</slot>
      </span>
        <p class="er-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="er-alert__close" v-if="closable">
          <er-icon @click.stop="close" icon="xmark"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
