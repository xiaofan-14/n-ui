import { describe, expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import ErPopconfirm from "../src/popconfirm.vue"
import type { popconfirmProps } from "../src/popconfirm"
import { each, get } from 'lodash-es'

describe("Popconfirm.vue", () => {
  const props = {
    title: "Are you sure?",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    confirmButtonType: "primary",
    cancelButtonType: "default",
    icon: "warning",
    iconColor: "#f00",
    hideAfter: 2000,
    width: 300,
  } as popconfirmProps
  it('should accept all props',()=>{
    const wrapper = mount(ErPopconfirm, {
      props
    })

    each(props, (value, key) => {
      expect(get(wrapper.props(), key)).toEqual(value)
    })
  })
});
