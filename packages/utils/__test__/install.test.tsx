import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createApp} from "vue"

import {withInstall, setupInstall} from '../'

const appComp = defineComponent({
  setup() {
    return () => <div>App</div>
  }
})
const compA = withInstall(defineComponent({
  setup() {
    return () => <div>ComA</div>
  }
}))
const compB = withInstall(defineComponent({
  setup() {
    return () => <div>ComB</div>
  }
}))

describe('install ', () => {
  it('withInstall should be worked', () => {
    const wrapper = mount(()=><div id='app'></div>)
    const app = createApp(appComp)
    app.use(compA).use(compB).mount(wrapper.element)
    expect(compA.install).toBeDefined()
    expect(compB.install).toBeDefined()
    expect(wrapper.findComponent(compA)).toBeTruthy()
    expect(wrapper.findComponent(compB)).toBeTruthy()
  })

  it('setupInstall should be worked', ()=>{
    const wrapper = mount(()=><div id='app'></div>)
    const app = createApp(appComp)
    const installer = setupInstall([compA, compB])
    app.use(installer).mount(wrapper.element)
    expect(installer).toBeDefined()
    expect(wrapper.findComponent(compA)).toBeTruthy()
    expect(wrapper.findComponent(compB)).toBeTruthy()
  })
})
