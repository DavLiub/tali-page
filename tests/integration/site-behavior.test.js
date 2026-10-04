import { afterEach, describe, expect, test } from "vitest";
import { loadSite } from "../helpers/load-site.js";

let activeDom;
afterEach(() => activeDom?.window.close());

describe("site behavior", () => {
  test("starts in Russian and renders dynamic sections", () => {
    activeDom = loadSite();
    const { document } = activeDom.window;
    expect(document.documentElement.lang).toBe("ru");
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.querySelectorAll(".service-card")).toHaveLength(6);
    expect(document.querySelectorAll(".faq-item")).toHaveLength(4);
  });

  test("switches to Hebrew and persists the choice", () => {
    activeDom = loadSite();
    const { document, localStorage } = activeDom.window;
    document.querySelector('[data-language="he"]').click();
    expect(document.documentElement.lang).toBe("he");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem("tali-language")).toBe("he");
    expect(document.querySelector('[data-language="he"]').getAttribute("aria-pressed")).toBe("true");
  });

  test("restores a saved language", () => {
    activeDom = loadSite("he");
    expect(activeDom.window.document.documentElement.lang).toBe("he");
  });

  test("opens and closes the mobile menu", () => {
    activeDom = loadSite();
    const { document } = activeDom.window;
    const menuButton = document.querySelector(".menu-button");
    const mobileNavigation = document.querySelector(".mobile-nav");
    menuButton.click();
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");
    expect(mobileNavigation.hidden).toBe(false);
    mobileNavigation.querySelector("a").click();
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(mobileNavigation.hidden).toBe(true);
  });

  test("toggles a FAQ answer", () => {
    activeDom = loadSite();
    const { document } = activeDom.window;
    const question = document.querySelector(".faq-question");
    const answer = document.getElementById(question.getAttribute("aria-controls"));
    question.click();
    expect(question.getAttribute("aria-expanded")).toBe("true");
    expect(answer.hidden).toBe(false);
  });

  test("validates required fields without attempting delivery", async () => {
    activeDom = loadSite();
    const { document } = activeDom.window;
    const form = document.querySelector("[data-form]");
    form.dispatchEvent(new activeDom.window.Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    expect(document.querySelector("[data-status]").classList.contains("error")).toBe(true);
    expect(form.querySelector('[name="name"]').getAttribute("aria-invalid")).toBe("true");
  });
});
