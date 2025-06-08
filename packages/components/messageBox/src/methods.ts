import {
  createVNode,
  isVNode, nextTick,
  ref,
  render,
} from 'vue'
import {
  each,
  set,
  isFunction,
  isString,
  isObject,
  isUndefined,
  assign
} from "lodash-es"
import NMessageBoxConstructor from './messageBox.vue'

import type {
  ComponentPublicInstance,
  VNode,
  VNodeProps,
  Ref
} from 'vue'
import type {
  MessageBoxAction,
  MessageBoxProps,
  MessageBoxOptions,
  MessageBoxCallback,
  MessageBoxData,
  NMessageBox,
} from './messageBox'

const messageInstanceMap =
  new Map<ComponentPublicInstance<{ doClose: () => void }>, {
    options: MessageBoxOptions,
    callback: MessageBoxCallback | void,
    resolve: (res: any) => void,
    reject: (res: any) => void
  }>()

function initInstance(props: MessageBoxProps, container: HTMLElement) {
  const visible = ref(false)
  const isVNodeMsg = isFunction(props?.message) || isVNode(props?.message)

  const genDefaultSlot = (msg: VNode | (() => VNode)) =>
    isFunction(msg) ? msg : () => msg

  const vnode = createVNode(
    NMessageBoxConstructor, {
      ...props,
      visible,
    } as VNodeProps,
    isVNodeMsg ? {default: genDefaultSlot(props.message as VNode)} : void 0)

  render(vnode, container)
  document.body.appendChild(container.lastElementChild!)
  return vnode.component
}

function createMessage(options: MessageBoxOptions) {
  const container = document.createElement('div')
  const props: MessageBoxProps = {
    ...options,
    doClose() {
      vm.visible.value = false
    },
    async doAction(action: MessageBoxAction, inputVal?: string) {
      const currentMsg = messageInstanceMap.get(vm)
      let resolve: MessageBoxAction | { value: string, action: MessageBoxAction }
      await nextTick(() => vm.doClose())

      if (options.showInput) {
        resolve = {value: inputVal!, action}
      } else {
        resolve = action
      }

      if (options.callback) {
        options.callback(resolve)
        return
      }

      if (action === 'cancel' || action === 'close') {
        return currentMsg?.reject(action)
      }
      currentMsg?.resolve(resolve)
    },
    destroy() {
      render(null, container)
      messageInstanceMap.delete(vm)
    }
  }

  const instance = initInstance(props as MessageBoxProps, container)
  const vm = instance?.proxy as ComponentPublicInstance<{ doClose: () => void, visible: Ref<boolean> }>

  vm.visible.value = true
  return vm
}

async function MessageBox(options: MessageBoxOptions): Promise<MessageBoxData>;

function MessageBox(options: MessageBoxOptions | string | VNode)
  : Promise<MessageBoxData> {
  let callback: MessageBoxCallback | void

  if (isString(options) || isVNode(options)) {
    options = {
      message: options
    }
  } else {
    callback = options.callback
  }

  return new Promise((resolve, reject) => {
    const instance = createMessage(options)
    messageInstanceMap.set(instance, {options, callback, resolve, reject})
  })
}

const MESSAGE_BOX_VARIANTS = ['alert', 'confirm', 'prompt']
const MESSAGE_BOX_DEFAULT_OPTS: Record<(typeof MESSAGE_BOX_VARIANTS)[number], Partial<MessageBoxOptions>> = {
  alert: {closeOnClickModal: false},
  confirm: {showCancelButton: true},
  prompt: {showCancelButton: true, showInput: true},
}

each(MESSAGE_BOX_VARIANTS, (type) => set(MessageBox, type, messageBoxFactory(type)))

function messageBoxFactory(boxType: (typeof MESSAGE_BOX_VARIANTS)[number]) {
  return (
    message: string | number,
    title: string | MessageBoxOptions,
    options: MessageBoxOptions
  ) => {
    let titleOrOpts: string
    if (isObject(title)) {
      options = title as MessageBoxOptions
      titleOrOpts = ''
    } else if (isUndefined(title)) {
      titleOrOpts = ''
    } else {
      titleOrOpts = title as string
    }
    return MessageBox(
      assign({
        title: titleOrOpts,
        message,
        type: '',
        boxType,
        ...MESSAGE_BOX_DEFAULT_OPTS[boxType]
      }, options)
    )
  }
}

set(MessageBox, 'close', ()=>{
  messageInstanceMap.forEach((_, vm)=>{
    vm.doClose()
  })
  messageInstanceMap.clear()
})

export default MessageBox as NMessageBox
