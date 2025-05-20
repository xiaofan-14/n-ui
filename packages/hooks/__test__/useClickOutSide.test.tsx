import {describe, expect, it, vi} from 'vitest'
import {ref, defineComponent} from "vue"
import {mount} from '@vue/test-utils'
import useClickOutSide from "../useClickOutSide"

describe('hooks/useClickOutSide', () => {
  it('should add "click-outside" listener', async () => {
    const target = ref<HTMLElement>()
    const btnRef = ref<HTMLElement>()
    const handler = vi.fn()
    mount(
      defineComponent({
        setup() {
          useClickOutSide(target, handler)
          return ()=> <div id='container' ref={target}>
            <button ref={btnRef}>click me</button>
          </div>
        }
      })
    );
    (btnRef.value as HTMLElement)!.click()
    expect(handler).not.toHaveBeenCalled()
    document.body.click()
    expect(handler).toHaveBeenCalledOnce()
  })
  it('should handle null elementRef', async () => {
    const target = ref<HTMLElement | undefined>()
    const handler = vi.fn()
    mount(
      defineComponent({
        setup() {
          useClickOutSide(target, handler)
          return ()=> <div>No ref attached</div>
        }
      })
    )

    // 元素为 null 时触发单击事件
    document.body.click()

    // 由于提前返回，不调用处理程序
    expect(handler).not.toHaveBeenCalled()
  })
})
