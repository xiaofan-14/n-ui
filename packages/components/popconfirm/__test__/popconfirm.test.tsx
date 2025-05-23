import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ErPopconfirm } from "../";
import type { popconfirmProps } from "../";
import { each, get } from "lodash-es";
import { withInstall } from "@learn-ui-to-me/utils";
import Popconfirm from "../src/popconfirm.vue";

const onConfirm = vi.fn();
const onCancel = vi.fn();

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
  } as popconfirmProps;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllMocks();
  });

  it("should accept all props", () => {
    const wrapper = mount(ErPopconfirm, {
      props,
    });

    each(props, (value, key) => {
      expect(get(wrapper.props(), key)).toEqual(value);
    });
  });
  it('popconfirm emits',async ()=>{
    const wrapper = mount(()=>(
      <div>
        <div id="outside"></div>
        <ErPopconfirm
         title="Test Title"
         hideIcon={true}
         onConfirm={onConfirm}
         onCancel={onCancel}
        >
          <button id="trigger"></button>
        </ErPopconfirm>
      </div>
    ))

    const trigger = wrapper.find('#trigger')
    expect(trigger.exists()).toBeTruthy()

    trigger.trigger('click')
    await vi.runAllTimers()

    expect(wrapper.find('.er-popconfirm').exists()).toBeTruthy()
    const confirmBtn = wrapper.find('.er-popconfirm__confirm')
    expect(confirmBtn.exists()).toBeTruthy()

    confirmBtn.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.er-popconfirm').exists()).toBeFalsy()
    expect(onConfirm).toBeCalled()

    const cancelBtn = wrapper.find('.er-popconfirm__cancel')
    expect(cancelBtn.exists()).toBeTruthy()

    cancelBtn.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.er-popconfirm').exists()).toBeFalsy()
    expect(onCancel).toBeCalled()

  })
});

describe("Popconfirm/index.ts", () => {
  it("should be exported with withInstal", () => {
    expect(ErPopconfirm.install).toBeCalled();
  });
  it("should be exported popconfirm component", () => {
    expect(ErPopconfirm).toBe(Popconfirm);
  });
  it("should enhance popconfirm component", () => {
    const enhancedPopconfirm = withInstall(Popconfirm);
    expect(enhancedPopconfirm).toBe(Popconfirm);
  });
  it("should apply specifiy enhancements", () => {
    const enhancedPopconfirm = withInstall(Popconfirm);
    expect(enhancedPopconfirm).toHaveProperty("install");
  });
});
