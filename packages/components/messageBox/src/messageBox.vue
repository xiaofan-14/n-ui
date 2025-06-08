<script setup lang="ts">
import {reactive, computed, ref, nextTick, watch} from 'vue'
import {useZIndex, useId} from '@n-ui/hooks'
import {isNil, isFunction} from 'lodash-es'
import {typeIconMap} from '@n-ui/utils'
import {NOverlay} from "../../overlay"
import {NButton} from '../../button'
import {NInput} from '../../input'
import {NIcon} from '../../icon'

import type {Ref} from 'vue'
import type {InputInstance} from '../../input'
import type {MessageBoxProps, MessageBoxAction} from './messageBox'


defineOptions({
  name: "NMessageBox"
})

const props = withDefaults(defineProps<MessageBoxProps>(), {
  lockScroll: true,
  showClose: true,
  closeOnClickModal: true,
  confirmButtonType: 'primary',
  roundButton: false,
  boxType: '',
  inputValue: '',
  inputPlaceholder: 'Please input...',
  confirmButtonText: 'Ok',
  cancelButtonText: 'Cancel',
  showConfirmButton: true
})

const {doAction} = props
const {nextZIndex} = useZIndex()

const headerRef = ref<HTMLElement>()
const inputRef = ref<InputInstance>()
const inputId = useId()

const state = reactive({
  ...props,
  zIndex: nextZIndex()
})

const hasMessage = computed(() => !!state.message)
const iconComponent = computed(() => state.icon ?? typeIconMap.get(state.type ?? ''))

watch(
  () => props.visible?.value,
  (value) => {
    if (value) state.zIndex = nextZIndex()
    if (props.boxType === 'prompt') return
    if (!value) return

    nextTick(() => {
      inputRef.value && inputRef.value.focus()
    })
  }
)

function handleWrapperClick() {
  props.closeOnClickModal && handleAction('close')
}

function handleInputEnter(e: KeyboardEvent) {
  if (state.inputType === 'textarea') return
  e.preventDefault()
  return handleAction('confirm')
}

function handleAction(action: MessageBoxAction) {
  isFunction(props.beforeClose)
    ? props.beforeClose(action, state, () => doAction(action, state.inputValue))
    : doAction(action, state.inputValue)
}

function handleClose() {
  handleAction('close')
}
</script>

<template>
  <transition name="fade-in-linear" @after-leave="destroy">
    <n-overlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
      <div
        role="dialog"
        class="n-overlay-message-box"
        @click="handleWrapperClick"
      >
        <div
          ref="rootRef"
          :class="[
            'n-message-box',
            {
              'is-center': state.center,
            },
          ]"
          @click.stop
        >
          <div
            v-if="!isNil(state.title)"
            ref="headerRef"
            class="n-message-box__header"
            :class="{ 'show-close': state.showClose }"
          >
            <div class="n-message-box__title">
              <n-button
                v-if="iconComponent && state.center"
                :class="{
                  [`n-icon-${state.type}`]: state.type,
                }"
                :icon="iconComponent"
              />
              {{ state.title }}
            </div>
            <button
              v-if="showClose"
              class="n-message-box__header-btn"
              @click.stop="handleClose"
            >
              <n-icon icon="xmark"/>
            </button>
          </div>
          <div class="n-message-box__content">
            <n-icon
              v-if="iconComponent && !state.center && hasMessage"
              :class="{
                [`n-icon-${state.type}`]: state.type,
              }"
              :icon="iconComponent"
            />
            <div v-if="hasMessage" class="n-message-box__message">
              <slot>
                <component
                  :is="state.showInput ? 'label' : 'p'"
                  :for="state.showInput ? inputId : void 0"
                >
                  {{ state.message }}
                </component>
              </slot>
            </div>
          </div>
          <div v-show="state.showInput" class="n-message-box__input">
            <n-input
              v-model="state.inputValue"
              ref="inputRef"
              :placeholder="state.inputPlaceholder"
              :type="state.inputType"
              @keyup.enter="handleInputEnter"
            />
          </div>
          <div class="n-message-box__footer">
            <n-button
              v-if="state.showCancelButton"
              class="n-message-box__footer-btn n-message-box__cancel-btn"
              :type="state.cancelButtonType"
              :round="state.roundButton"
              :loading="state.cancelButtonLoading"
              @click="handleAction('cancel')"
              @keydown.prevent.enter="handleAction('cancel')"
            >{{ state.cancelButtonText }}
            </n-button
            >
            <n-button
              v-show="state.showConfirmButton"
              class="n-message-box__footer-btn n-message-box__confirm-btn"
              :type="state.confirmButtonType ?? 'primary'"
              :round="state.roundButton"
              :loading="state.confirmButtonLoading"
              @click="handleAction('confirm')"
              @keydown.prevent.enter="handleAction('confirm')"
            >{{ state.confirmButtonText }}
            </n-button>
          </div>
        </div>
      </div>
    </n-overlay>
  </transition>
</template>

<style scoped>
@import '../style/style.css';
</style>
