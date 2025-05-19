import {describe, expect, it, vi} from 'vitest'
import {ref, defineComponent} from "vue"
import {mount} from '@vue/test-utils'
import useEventListener from "../useEventListener"

describe('hooks/useEventListener', () => {
  it('should add and remove event listener when target is HTMLElement ', async () => {
    const target = document.createElement('button')
    const handler = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          useEventListener(target, 'click', handler)
          return () => <div id='container'></div>
        }
      })
    )
    wrapper.get('#container').element.appendChild(target)
    target.click()
    expect(handler).toHaveBeenCalledOnce()
    wrapper.unmount()
    target.click()
    expect(handler).toHaveBeenCalledOnce()
  })

  it("should add and remove event listener when target is Ref<HTMLElement>", async () => {
    const target = ref<HTMLElement | void>();
    const handler = vi.fn();

    const wrapper = mount(
      defineComponent({
        setup() {
          useEventListener(target, "click", handler);
          return () => <button id="container" ref={target}></button>;
        },
      })
    );

    // 等待组件挂载
    await wrapper.vm.$nextTick();

    // 使用wrapper.find 找到button元素
    const button = wrapper.find('#container');

    // 第一次点击
    await button.trigger('click');

    // 验证点击事件是否触发，触发一次
    expect(handler).toHaveBeenCalledTimes(1);

    // 重置模拟以使跟踪更清晰
    handler.mockClear();

    // 改变target为一个新的元素
    target.value = document.createElement("div");
    await wrapper.vm.$nextTick();

    // 再次点击button按钮
    await button.trigger('click');

    // 由于我们改变了target因此不触发点击事件
    expect(handler).toHaveBeenCalledTimes(0);
  })
})
