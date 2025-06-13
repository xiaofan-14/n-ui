<script setup lang="ts">
import type {alertProps, alertEmits, alertInstance} from './alert'
import {ref, computed} from "vue"
import {NIcon} from '../../icon'
import {typeIconMap} from "@n-ui/utils"
import {useNamespace} from "@n-ui/hooks"

defineOptions({ name: 'NAlert' })

const props = withDefaults(defineProps<alertProps>(), {
  effect: 'light',
  type: 'info',
  closable: true
})

const emits = defineEmits<alertEmits>()
const slots = defineSlots()

const ns = useNamespace('alert')

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
  <transition :name="ns.b('fade')">
    <div
      v-show="visible"
      class="n-alert"
      role="alert"
      :class="{
      [`n-alert__${type}`]: type,
      [`n-alert__${effect}`]: effect,
      'text-center': center
    }">
      <n-icon
        v-if="showIcon"
        class="n-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <div class="n-alert__content">
      <span
        class="n-alert__title"
        :class="{ 'with-desc': withDescription}"
        :style="{ display: center && !showIcon ? 'flow' : 'inline'}"
      >
      <slot name="title">{{ title }}</slot>
      </span>
        <p class="n-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="n-alert__close" v-if="closable">
          <n-icon @click.stop="close" icon="xmark"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
