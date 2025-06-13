import { describe, expect, it } from 'vitest'
import {mount} from "@vue/test-utils"
import {NIcon} from "../index.ts";

describe('Icon.vue', ()=>{
  it('render', ()=>{
    const wrapper = mount(
      () => <NIcon icon={''} color={'#000000'} />
    )
    expect(wrapper.element.getAttribute('style')).toContain(`color: rgb(0, 0, 0)`)
  })
})
