import {inject, computed, ref, useSlots} from 'vue'
import {BUTTON_GROUP_CTX} from "./contants"
import {useFormDisabled, useFormItem} from "../../form"
import type {ButtonEmits, ButtonProps} from "./button"

export function useButton(
  props: ButtonProps,
  emits: ButtonEmits
) {
  // button group 注入的上下文
  const ctx = inject(BUTTON_GROUP_CTX, void 0)

  const { formItem} = useFormItem()

  // 计算大小类型
  const _size = computed(() => {
    return ctx?.size ?? props?.size ?? ''
  })

  // 计算标签的 type
  const _type = computed(() => {
    return ctx?.type ?? props?.type ?? ''
  })

  // 是否禁用
  const _disabled = useFormDisabled(ctx?.disabled)

  // 实例
  const _ref = ref<HTMLButtonElement>()
  // 插槽
  const slots = useSlots()

  // props
  const _props = computed(() => {
    if (props.tag === 'button') {
      return {
        id: props.id,
        autofocus: props.autofocus,
        type: props.tag === 'button' ? props.nativeType : void 0,
        disabled: _disabled.value || props.loading ? true : void 0
      }
    }
    if(props.tag === 'a'){
      return {
        href: props.href,
      }
    }
    return {}
  })

  // 处理点击事件
  function handleClick(evt: MouseEvent) {
    // 如果没有禁用，并且没有出入加载状态
    if (_disabled.value || props.loading) {
      evt.stopPropagation()
      return
    }
    // 如果是表单的 reset 执行表单提供的 reset 方法
    if (props.nativeType === 'reset') {
      formItem?.resetField()
    }
    // 通过 emit 触发点击
    emits('click', evt)
  }

  return {
    _size,
    _type,
    _disabled,
    _ref,
    slots,
    _props,
    handleClick,
  }
}
