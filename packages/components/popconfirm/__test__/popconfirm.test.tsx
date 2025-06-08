import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { NPopconfirm } from "../";
import type { popconfirmProps } from "../";
import { each, get } from "lodash-es";
import { withInstall } from "@n-ui/utils";
import Popconfirm from "../src/popconfirm.vue";
// import { nextTick } from "vue";
// import { NConfigProvider } from '../../configProvider'


// const onConfirm = vi.fn();
// const onCancel = vi.fn();

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
    const wrapper = mount(NPopconfirm, {
      props,
    });

    each(props, (value, key) => {
      expect(get(wrapper.props(), key)).toEqual(value);
    });
  });

  // it("popconfirm emits", async () => {
  //   const wrapper = mount(() => (
  //     <ErConfigProvider>
  //       <div>
  //         <div id="outside"></div>
  //         <Popconfirm
  //           title="Test Title"
  //           hideIcon={true}
  //           onConfirm={onConfirm}
  //           onCancel={onCancel}
  //         >
  //           <button id="trigger">trigger</button>
  //         </Popconfirm>
  //       </div>
  //     </ErConfigProvider>
  //   ),{
  //        global: {
  //     plugins: [i18n],
  //     stubs: {
  //       // Stub teleport 防止弹层挂到 body 导致找不到
  //       teleport: true,
  //     },
  //   },
  //   });
  //   const triggerArea = wrapper.find("#trigger");
  //   expect(triggerArea.exists()).toBeTruthy();

  //   await triggerArea.trigger("click");
  //   await nextTick();

  //   vi.useFakeTimers();
  //   vi.runAllTimers();
  //   await nextTick();

  //   // 弹出层是否出现 er-popconfirm 在浏览器中行为是正常的

  //   expect(wrapper.find(".n-popconfirm").exists()).toBeTruthy();
  //   const confirmButton = wrapper.find(".n-popconfirm__confirm");
  //   expect(confirmButton.exists()).toBeTruthy();

  //   confirmButton.trigger("click");
  //   await vi.runAllTimers();
  //   expect(wrapper.find(".n-popconfirm").exists()).toBeFalsy();
  //   expect(onConfirm).toBeCalled();

  //   triggerArea.trigger("click");
  //   await vi.runAllTimers();
  //   expect(wrapper.find(".n-popconfirm").exists()).toBeTruthy();
  //   const cancelButton = wrapper.find(".n-popconfirm__cancel");
  //   expect(cancelButton.exists()).toBeTruthy();

  //   await vi.runAllTimers();
  //   cancelButton.trigger("click");
  //   await vi.runAllTimers();
  //   expect(wrapper.find(".n-popconfirm").exists()).toBeFalsy();
  //   expect(onCancel).toBeCalled();
  // });
});

describe("Popconfirm/index.ts", () => {
  it("should be exported with withInstal", () => {
    expect(NPopconfirm.install).toBeDefined();
  });

  it("should be exported popconfirm component", () => {
    expect(NPopconfirm).toBe(Popconfirm);
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
