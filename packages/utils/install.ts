import { defineComponent } from 'vue'
import { isFunction } from 'lodash-es'
import type {App, Plugin} from 'vue'

type SFCWithInstall<T> = T & Plugin

export function withInstall<T>(component: T){
    (component as SFCWithInstall<T>).install = (app: App) => {
        const name = ( component as any).name
        app.component(name, component as Plugin)
    }

    return component as SFCWithInstall<T>
}


export const renderVNode = defineComponent({
  props: {
    vNode: {
      type:[ String, Object, Function],
      required: true
    }
  },
  setup(props){
    return () => (isFunction(props.vNode) ? props.vNode() : props.vNode )
  }
})
