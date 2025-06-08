import { describe, it, expect } from "vitest";
import { notification, closeAll } from "../src/methods";
import { rAF } from "@n-ui/utils";

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue || '0');
}

describe("createMessage", () => {
  it("call notification()", async () => {
    const handler = notification({
      message: "hello msg",
      duration: 0,
      position: "top-right",
      title: "Default Title",
    });
    await rAF();
    expect(document.querySelector(".n-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".n-notification")).toBeFalsy();
  });

  it("call notification() more times", async () => {
    notification({
      message: "hello msg",
      duration: 0,
      position: "top-right",
      title: "Default Title",
    });
    notification({
      message: "hello msg",
      duration: 0,
      position: "top-right",
      title: "Default Title",
    });
    await rAF();
    expect(document.querySelectorAll(".n-notification").length).toBe(2);
    closeAll();
    await rAF();
    expect(document.querySelectorAll(".n-notification").length).toBe(0);
  });

  it("offset", async () => {
    notification({
      message: "hello msg",
      duration: 0,
      position: "top-right",
      title: "Default Title",
      offset: 100,
    });
    notification({
      message: "hello msg",
      duration: 0,
      position: "top-right",
      title: "Default Title",
      offset: 50,
    });
    await rAF();
    const elements = document.querySelectorAll(".n-notification");
    expect(elements.length).toBe(2);

    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
