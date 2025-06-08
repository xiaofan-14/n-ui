import LoadingComp from './loading.vue'
import { createApp, nextTick, reactive, ref } from 'vue'
import { useZIndex } from '@n-ui/hooks'
import type {
  LoadingOptions,
  LoadingOptionsResolved
} from './loading'
import {
  isNil,
  isString,
  delay
} from "lodash-es"


const RELATIVE_CLASS = `n-loading-parent--relative` as const
const HIDE_CLASS = `n-loading-parent--hide` as const
const LOADING_NUMBER_KEY = `n-loading-number` as const

const { nextZIndex } = useZIndex(3000)

const instanceMap = new Map<HTMLElement, LoadingInstance>();

function addRelativeClass(target: HTMLElement = document.body) {
  target.classList.add(RELATIVE_CLASS)
}

function removeRelativeClass(target: HTMLElement = document.body) {
  target.classList.remove(RELATIVE_CLASS)
}

function addHideClass(target: HTMLElement = document.body) {
  target.classList.add(HIDE_CLASS)
}

function removeHideClass(target: HTMLElement = document.body) {
  target.classList.remove(HIDE_CLASS)
}

function getLoadingNumber(target: HTMLElement = document.body) {
  return target.getAttribute(LOADING_NUMBER_KEY)
}

function addLoadingNumber(target: HTMLElement = document.body) {
  const numb = getLoadingNumber(target) ?? '0'
  target.setAttribute(LOADING_NUMBER_KEY, `${Number.parseInt(numb!) + 1}`)
}

function subLoadingNumber(target: HTMLElement = document.body) {
  const numb = getLoadingNumber(target)
  if (numb) {
    const newNumber = Number.parseInt(numb) - 1
    if (newNumber === 0) {
      removeLoadingNumber(target)
    } else {
      target.setAttribute(LOADING_NUMBER_KEY, `${newNumber}`)
    }
  }
}

function removeLoadingNumber(target: HTMLElement = document.body) {
  target.removeAttribute(LOADING_NUMBER_KEY)
}

function createLoading(opts: LoadingOptionsResolved) {
  const visible = ref(opts.visible)
  const afterLeaveFlag = ref(false)
  const handleAfterLeave = () => {
    if (!afterLeaveFlag.value) return
    destory()
  }
  const data = reactive({
    ...opts,
    onAfterLeave: handleAfterLeave
  })
  const setText = (text: string) => data.text = text

  const app = createApp(LoadingComp, {
    ...data,
    zIndex: data.fullscreen ? nextZIndex() : void 0,
    visible
  })
  const vm = app.mount(document.createElement('div'))

  const destory = () => {
    const target = data.parent
    subLoadingNumber(target!)
    if (getLoadingNumber(target!)) return
    delay(() => {
      removeRelativeClass(target)
      removeHideClass(target)
    }, 1)

    instanceMap.delete(target || document.body)
    vm.$el?.parentNode?.removeChild(vm.$el)
    app.unmount()
  }
  let afterLeaveTimer: number

  const close = () => {
    if (opts.beforeClose && !opts.beforeClose) return

    afterLeaveFlag.value = true
    clearTimeout(afterLeaveTimer)
    afterLeaveTimer = delay(handleAfterLeave, 500)

    visible.value = false
    opts.closed?.()
  }

  return {
    get $el(): HTMLElement {
      return vm.$el
    },
    vm,
    close,
    visible,
    setText
  }
}

function resolveOpts(opts: LoadingOptions): LoadingOptionsResolved {
  let target: HTMLElement
  if (isString(opts.target)) {
    target = document.querySelector(opts.target) ?? document.body
  } else {
    target = opts.target ?? document.body
  }
  return {
    parent: target === document.body || opts.body ? document.body : target,
    background: opts.background ?? 'rgba(0,0,0,0.5)',
    spinner: opts.spinner,
    text: opts.text,
    fullscreen: target === document.body && (opts.fullscreen ?? true),
    lock: opts.lock ?? false,
    visible: opts.visible ?? true,
    target
  }
}

function addClass(opts: LoadingOptions, target: HTMLElement = document.body) {
  if (opts.lock) {
    addHideClass(target)
  } else {
    removeHideClass(target)
  }
  addRelativeClass(target)
}

export type LoadingInstance = ReturnType<typeof createLoading>

let fullscreenInstance: LoadingInstance | null = null

export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOpts(options)

  const target = resolved.parent ?? document.body

  if (resolved.fullscreen && !isNil(fullscreenInstance)) return fullscreenInstance

  // 增加 loading 的 number
  addLoadingNumber(resolved.parent)
  // 如果在缓存中存在
  if (instanceMap.has(target)) return instanceMap.get(target)!

  const instance = createLoading({
    ...resolved,
    closed() {
      resolved.closed?.()
      if (resolved.fullscreen) {
        fullscreenInstance = null
      }
    },
  })

  addClass(options, resolved?.parent)

  resolved.parent?.appendChild(instance.$el)

  nextTick(() => (instance.visible.value = !!resolved.visible))

  if (resolved.fullscreen) {
    fullscreenInstance = instance
  }

  instanceMap.set(target, instance)

  return instance
}
