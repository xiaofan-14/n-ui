import { Loading } from './service'

import type {
  Directive,
  DirectiveBinding,
  MaybeRef
} from 'vue'
import type { LoadingOptions } from './loading'
import type { LoadingInstance } from './service'

const INSTANCE_KEY = Symbol('loading')

export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance
    options: LoadingOptions
  }
}

function createInstance(
  el: ElementLoading,
  binding: DirectiveBinding<boolean>
){
  function getProps<K extends keyof LoadingOptions>(name: K){
    return el.getAttribute(`er-loading-${name}`) as MaybeRef<string>
  }

  function getModifier<K extends keyof LoadingOptions>(name: K){
    return binding.modifiers[name]
  }
  const fullscreen = getModifier('fullscreen')

  const options: LoadingOptions = {
    text: getProps('text'),
    spinner: getProps('spinner'),
    background: getProps('background'),
    target: fullscreen ? void 0 : el,
    body: getModifier('body'),
    lock: getModifier('lock'),
    fullscreen
  }

  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options)
  }
}

export const vLoading:Directive<ElementLoading, boolean> = {
   mounted(el: ElementLoading, binding: DirectiveBinding<boolean>){
    if(binding.value) createInstance(el, binding)
  },
   updated(el: ElementLoading, binding: DirectiveBinding<boolean>){
    if(binding.oldValue === binding.value) return

    if(binding.value && !binding.oldValue) return createInstance(el, binding)

    el[INSTANCE_KEY]?.instance.close()
  },
   unmounted(el: ElementLoading){
    el[INSTANCE_KEY]?.instance.close()
    el[INSTANCE_KEY] = void 0
  }
}
