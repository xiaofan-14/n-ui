import type {ButtonEmits, ButtonProps} from "./button.ts"
import { useSlots} from "vue"
import {BUTTON_GROUP_CTX} from "./contants.ts"
import {inject, computed, ref} from 'vue'
import {useFormDisabled, useFormItem} from "../../form"


export function useButton(
  props: ButtonProps,
  emits: ButtonEmits
) {
  const ctx = inject(BUTTON_GROUP_CTX, void 0)

  const { formItem} = useFormItem()
  const _size = computed(() => ctx?.size ?? props?.size ?? '')
  const _type = computed(() => ctx?.type ?? props?.type ?? '')
  const _disabled = computed(()=>
    useFormDisabled().value || props.disabled
  )
  const _ref = ref<HTMLButtonElement>()
  const slots = useSlots()

  const _props = computed(()=>{
    if(props.tag === 'button') {
      return {
        id: props.id,
        autofocus: props.autofocus,
        type: props.tag === 'button' ? props.nativeType : void 0,
        disabled: _disabled.value || props.loading ? true : void 0
      }
    }
    return {}
  })


  function handleClick (evt: MouseEvent) {
    if (_disabled.value || props.loading) {
      evt.stopPropagation()
      return
    }
    if (props.nativeType === 'reset') {
      formItem?.resetField()
    }
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
