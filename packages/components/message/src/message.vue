<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ErIcon } from '../../icon'
import type { MessageProps } from './message'
import { delay } from 'lodash-es'
import { typeIconMap, renderVNode } from '@learn-ui-to-me/utils'

defineOptions({
  name: 'ErMessage'
})

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'success',
  druation: 3000,
  offset: 10,
  transitionName: 'fade-up'
})

const visible = ref(false)
const messageRef = ref<HTMLDivElement>()
const iconName = computed(()=>typeIconMap.get(props.type) ?? 'circle-icon')

let timer: number

function startTimer(){
  if(props.duration === 0) return
  timer = delay(close, props.duration!)
}
function clearTimer(){
  clearTimeout(timer)
}

function close(){
  visible.value = false
}

onMounted(()=>{
  visible.value = true
  startTimer()
})

defineExpose({
  close
})
</script>

<template>
  <Transition :name="transitionName" @after-leave="!visible && onDestory()">
    <div class="er-message" ref="messageRef" :class="{
      [`er-message--${type}`]: type,
      'is-close': showClose,
      'text-center': center
    }"
    v-show="visible"
    role="alert"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
    >
    <er-icon class="er-message__icon" :icon="iconName" />
    <div class="er-message__content">
      <slot>
        <renderVNode v-if="message" :vNode="message" />
      </slot>
    </div>
    <div class="er-message__close" v-if="showClose">
      <er-icon icon="xmark" @click.stop="close" />
    </div>
  </div>
  </Transition>
</template>
