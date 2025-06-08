<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NIcon } from '../../icon'
import { delay } from 'lodash-es'
import { typeIconMap, renderVNode, addUnit } from '@n-ui/utils'
import { useOffset, useEventListener } from '@n-ui/hooks'
import { getLastBottomOffset } from './methods'
import { bind } from 'lodash-es'
import type { MessageProps, MessageComInstance } from './message'

defineOptions({
  name: 'NMessage'
})

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'success',
  druation: 3000,
  offset: 10,
  transitionName: 'fade-up'
})

const visible = ref(false)
const messageRef = ref<HTMLDivElement>()

const boxHeight = ref(0)

const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-icon')

const customStyle = computed(() => ({
  top: addUnit(topOffset.value),
  zIndex: props.zIndex
}))

const { topOffset, bottomOffset } = useOffset({
  offset: props.offset,
  boxHeight,
  getLastBottomOffset: bind(getLastBottomOffset, props)
})

let timer: number

function startTimer() {
  if (props.duration === 0) return
  timer = delay(close, props.duration!)
}

function clearTimer() {
  clearTimeout(timer)
}

function close() {
  visible.value = false
}

watch(visible ,(val)=>{
  // 使退出动画更加流畅
  if(!val) boxHeight.value = -props.offset
})

useEventListener(document, 'keydown',(e:Event)=>{
  const { code } = e as KeyboardEvent
  if(code === 'Escape') close()
})


onMounted(() => {
  visible.value = true
  startTimer()
})

defineExpose<MessageComInstance>({
  close,
  bottomOffset
})
</script>

<template>
  <Transition :name="transitionName" @after-leave="!visible && onDestroy()" @enter="boxHeight = messageRef!.getBoundingClientRect().height">
    <div class="n-message" ref="messageRef" :class="{
      [`n-message--${type}`]: type,
      'is-close': showClose,
      'text-center': center
    }" v-show="visible" role="alert" @mouseenter="clearTimer" @mouseleave="startTimer" :style="customStyle">
      <n-icon class="n-message__icon" :icon="iconName" />
      <div class="n-message__content">
        <slot>
          <renderVNode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div class="n-message__close" v-if="showClose">
        <n-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
