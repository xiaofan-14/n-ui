import { isVNode, render, h, shallowReactive } from 'vue'
import type {
  CreateMessageProps,
  MessageInstance,
  MessageFn,
  MessageHandler,
  Message,
  MessageParams,
  MessageProps,
  messageType
} from './message'
import { messageTypes } from './message'
import { findIndex, isString, set, each } from 'lodash-es'
import MessageConstructor from './message.vue'

let seed = 0
const instances: MessageInstance[] = shallowReactive([])

export const messageDefaults = {
  type: 'success',
  druation: 3000,
  offset: 10,
  transitionName: 'fade-up'
}

const normalizedOptions = (opts: MessageParams): CreateMessageProps => {
  const result = !opts || isVNode(opts) || isString(opts)
    ? { message: opts }
    : opts
  return { ...messageDefaults, ...result } as CreateMessageProps
}

function createMessage(props: CreateMessageProps): MessageInstance {
  const id = `message_${seed++}`
  const container = document.createElement('div')

  function destory() {
    const idx = findIndex(instances, { id })
    if (idx === -1) return
    instances.splice(idx, 1)
    render(null, container)
  }

  const _props: MessageProps = {
    ...props,
    id,
    zIndex: 200,
    onDestory: destory,
  }

  const vnode = h(MessageConstructor, _props)

  render(vnode, container)

  document.body.appendChild(container.firstElementChild!)

  const vm = vnode.component!
  const handler: MessageHandler = {
    close: () => vm.exposed?.close()
  }
  const instance: MessageInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler
  }
  instances.push(instance)
  return instance
}

export const message: MessageFn & Partial<Message> = (options: {}) => {
  const normalized = normalizedOptions(options)
  const instance = createMessage(normalized)

  return instance.handler
}

export function closeAll(type?: messageType) {
  each(instances, (item) => {
    if (type) {
      item.props.type === type && item.handler.close()
      return
    }
    item.handler.close()
  })
}

each(messageTypes, (type) => {
  set(message, type, (opts: MessageParams) => {
    const normalized = normalizedOptions(opts)
    return message({ ...normalized, type })
  })
})

message.closeAll = closeAll

export default message as Message

