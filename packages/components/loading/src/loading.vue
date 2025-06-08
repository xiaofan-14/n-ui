<script setup lang="ts">
import {computed} from 'vue'
import {isString} from "lodash-es"
import {NIcon} from '../../icon'

import type {Ref} from 'vue'
import type {LoadingOptions} from './loading'

defineOptions({
  name: 'NLoading',
  inheritAttrs: false
})

const props = defineProps<LoadingOptions>()

const iconName = computed(() => {
  if (isString(props.spinner)) return props.spinner
  return 'spinner'
})
</script>

<template>
  <transition name="fade-in-linear" @after-leave="onAfterLeave">
    <div
      v-show="(props.visible as Ref).value"
      class="n-loading n-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="n-loading__spinner">
        <n-icon v-if="props.spinner !== false" :icon="iconName" spin/>
        <p v-if="text" class="n-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '../style/style.css';

.n-loading {
  --n-loading-bg-color: v-bind(background) !important;
  --n-loading-z-index: v-bind(zIndex) !important;
}
</style>
