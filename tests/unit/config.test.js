import { describe, expect, test } from "vitest";
import { loadDataFiles } from "../helpers/load-site.js";

const { config } = loadDataFiles();

describe("site configuration", () => {
  test("uses a supported default language", () => {
    expect(config.languages).toContain(config.defaultLanguage);
    expect(new Set(config.languages).size).toBe(config.languages.length);
  });

  test("keeps contact delivery disabled until an endpoint is configured", () => {
    expect(config.contact.mode).toBe("preview");
    expect(config.contact.endpoint).toBe("");
  });
});
