<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ErIcon } from '../../icon'
import { delay } from 'lodash-es'
import { typeIconMap, addUnit } from '@learn-ui-to-me/utils'
import { useOffset } from '@learn-ui-to-me/hooks'
import { getLastBottomOffset } from './methods'
import { bind } from 'lodash-es'
import type { NotificationProps, NotificationCompInstance } from './notification'

defineOptions({
  name: 'ErNotifictaion'
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
  props.position.endsWith('top') ? 'top' : 'buttom'
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
  <transition :name="`er-notification-${transitionName}`" @after-leave="!visible && onDestroy()"
    @enter="boxHeight = notifyRef!.getBoundingClientRect().height">
    <div ref="notifyRef" class="er-notification" :class="{
      [`er-notification--${type}`]: type,
      [horizontalClass]: true,
      'show-close': showClose
    }" :style="customStyle" v-show="visible" role="alert" @click="onClick" @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <er-icon v-if="iconName" :icon="iconName" class="er-notification__icon" />

      <div class="er-notification__text">
        <div class="er-notification__title">{{ title }}</div>
        <div class="er-notification__content">
          <slot>
            <render-vnode v-if="message" :vNode="message" />
          </slot>
        </div>
      </div>
      <div class="er-notification__close" v-if="showClose">
        <er-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
