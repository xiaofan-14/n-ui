import {computed, type ComputedRef} from 'vue'
import {useNamespace} from "@n-ui/hooks"
import type {ButtonProps} from "./button"
import type { Slots } from 'vue'

export function useButtonCustomStyle(
  type: ComputedRef<string>,
  size: ComputedRef<string>,
  disabled: ComputedRef<boolean>,
  props: ButtonProps,
  slots: Slots
) {
  const ns = useNamespace('button')

  const buttonKls = computed(() => [
    ns.b(),
    type.value && ns.m(type.value),
    size.value && ns.m(size.value),
    ns.is('disabled', disabled.value),
    ns.is('loading', props.loading),
    ns.is('plain', props.plain),
    ns.is('round', props.round),
    ns.is('circle', props.circle)
  ])

  const iconStyle = computed(() => {
    const marginValue = slots.default ? '6px' : '0px'
    return {
      ...(props.icon && {marginRight: marginValue}),
      ...(props.suffixIcon && {marginLeft: marginValue})
    }
  })

  return {
    buttonKls,
    iconStyle
  }
}
