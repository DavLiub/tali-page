import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  for (const language of ["ru", "he"]) {
    test(`${language} ${viewport.name} layout and accessibility`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator(`[data-language="${language}"]`).click();
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      await expect(page.locator("html")).toHaveAttribute("dir", language === "he" ? "rtl" : "ltr");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("[data-form]")).toBeVisible();
      const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(hasHorizontalOverflow).toBe(false);
      const accessibility = await new AxeBuilder({ page }).analyze();
      expect(accessibility.violations.filter((violation) => ["critical", "serious"].includes(violation.impact))).toEqual([]);
    });
  }
}

test("mobile navigation and FAQ are usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".menu-button").click();
  await expect(page.locator(".mobile-nav")).toBeVisible();
  await page.locator(".faq-question").first().click();
  await expect(page.locator(".faq-answer").first()).toBeVisible();
});
