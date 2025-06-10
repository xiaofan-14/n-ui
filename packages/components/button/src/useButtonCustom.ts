import {computed, type ComputedRef} from 'vue'
import {useNamespace} from "@n-ui/hooks"
import type {ButtonProps} from "./button.ts";

export function useButtonCustomStyle(
  type: ComputedRef<string>,
  size: ComputedRef<string>,
  disabled: ComputedRef<boolean>,
  props: ButtonProps
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

  return {
    buttonKls,
  }
}
