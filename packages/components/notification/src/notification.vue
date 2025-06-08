<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { NIcon } from '../../icon'
import { delay } from 'lodash-es'
import { typeIconMap, addUnit, renderVNode } from '@n-ui/utils'
import { useOffset } from '@n-ui/hooks'
import { getLastBottomOffset } from './methods'
import { bind } from 'lodash-es'
import type { NotificationProps, NotificationCompInstance } from './notification'

defineOptions({
  name: 'NNotifictaion'
})

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  duration: 3000,
  offset: 20,
  position: 'top-right',
  transitionName: 'fade',
  showClose: true
})

const visible = ref(false)
const notifyRef = ref<HTMLDivElement>()

const boxHeight = ref(0)

const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-icon')

const horizontalClass = computed(()=>
  props.position.endsWith('right') ? 'right' : 'left'
)

const verticalProperty = computed(()=>
  props.position.startsWith('top') ? 'top' : 'bottom'
)

const { topOffset, bottomOffset } = useOffset({
  offset: props.offset,
  boxHeight,
  getLastBottomOffset: bind(getLastBottomOffset, props)
})

const customStyle = computed(() => ({
  [verticalProperty.value]: addUnit(topOffset.value),
  zIndex: props.zIndex
}))

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

watch(visible, (val) => {
  // 使退出动画更加流畅
  if (!val) boxHeight.value = -props.offset

})

onMounted(() => {
  visible.value = true
  startTimer()
})


defineExpose<NotificationCompInstance>({
  close,
  bottomOffset
})
</script>

<template>
  <transition :name="`n-notification-${transitionName}`" @after-leave="!visible && onDestroy()"
    @enter="boxHeight = notifyRef!.getBoundingClientRect().height">
    <div ref="notifyRef" class="n-notification" :class="{
      [`n-notification--${type}`]: type,
      [horizontalClass]: true,
      'show-close': showClose
    }" :style="customStyle" v-show="visible" role="alert" @click="onClick" @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <n-icon v-if="iconName" :icon="iconName" class="n-notification__icon" />

      <div class="n-notification__text">
        <div class="n-notification__title">{{ title }}</div>
        <div class="n-notification__content">
          <slot>
            <renderVNode v-if="message" :vNode="message" />
          </slot>
        </div>
      </div>
      <div class="n-notification__close" v-if="showClose">
        <n-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
