import { shallowReactive, isVNode, render, h } from 'vue'
import { useId, useZIndex } from '@learn-ui-to-me/hooks'
import { findIndex, get, isString, each, set } from 'lodash-es'
import { notificationTypes, notificationPosition } from './notification'
import NotificationConstructor from '../src/notification.vue'
import type {
  NotificationInstance,
  NotificationProps,
  NotificationParams,
  CreateNotificationProps,
  NotificationHandler,
  NotificationFn,
  NotificationType
} from './notification'

const instancesMap: Map<NotificationProps['position'], NotificationInstance[]> = new Map()

each(notificationPosition, position => {
  instancesMap.set(position, shallowReactive([]))
})

const { nextZIndex } = useZIndex()

export const notificationDefaults = {
  type: 'info',
  duration: 3000,
  offset: 20,
  transitionName: 'fade',
  showClose: true
}

const normalizedOptions = (opts: NotificationParams): CreateNotificationProps => {
  const result = !opts || isVNode(opts) || isString(opts)
    ? { message: opts }
    : opts
  return { ...notificationDefaults, ...result } as CreateNotificationProps
}

function getInstanceByPosition(
  position: NotificationProps['position']
): NotificationInstance[] {
  return instancesMap.get(position)!
}

function createNotification(props: CreateNotificationProps): NotificationInstance {
  const id = useId().value
  const container = document.createElement('div')
  const instances = getInstanceByPosition(props.position || 'top-right')

  function destory() {
    const idx = findIndex(instances, { id })
    if (idx === -1) return
    instances.splice(idx, 1)
    render(null, container)
  }

  const _props: NotificationProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestroy: destory,
  }

  const vnode = h(NotificationConstructor, _props)

  render(vnode, container)

  document.body.appendChild(container.firstElementChild!)

  const vm = vnode.component!
  const handler: NotificationHandler = {
    close: () => vm.exposed?.close()
  }
  const instance: NotificationInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler
  }
  instances.push(instance)
  return instance
}

export const notification: NotificationFn & Partial<Notification> = (options = {}) => {
  const normalized = normalizedOptions(options)
  const instance = createNotification(normalized)

  return instance.handler
}

export function closeAll(type?: NotificationType) {
  instancesMap.forEach(instances => {
    each(instances, (item) => {
      if (type) {
        item.props.type === type && item.handler.close()
        return
      }
      item.handler.close()
    })
  })
}

export function getLastBottomOffset(this: NotificationProps) {
  const instance = getInstanceByPosition(this.position || 'top-right')
  const idx = findIndex(instance, { id: this.id })
  if (idx <= 0) return 0

  return get(instance, [idx - 1, 'vm', 'exposed', 'bottomOffset', 'value'])
}

each(notificationTypes, type => {
  set(notification, type, (opts: NotificationParams) => {
    const normalized = normalizedOptions(opts)
    return notification({ ...normalized, type })
  })
})

notification.closeAll = closeAll

export default notification as Notification
