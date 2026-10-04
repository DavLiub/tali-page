import { describe, expect, test } from "vitest";
import { loadDataFiles } from "../helpers/load-site.js";

const { config, content } = loadDataFiles();
const structuredKeys = { services: 3, steps: 2, formats: 3, faqs: 2 };

describe("localized content", () => {
  test("contains every configured language", () => {
    expect(Object.keys(content).sort()).toEqual([...config.languages].sort());
  });

  test("has the same keys in Russian and Hebrew", () => {
    expect(Object.keys(content.he).sort()).toEqual(Object.keys(content.ru).sort());
  });

  test.each(config.languages)("%s has no empty values", (language) => {
    for (const [key, value] of Object.entries(content[language])) {
      expect(value, key).toBeTruthy();
      if (typeof value === "string") expect(value.trim(), key).not.toBe("");
    }
  });

  test.each(config.languages)("%s structured sections have valid entries", (language) => {
    for (const [key, expectedLength] of Object.entries(structuredKeys)) {
      expect(content[language][key].length, key).toBeGreaterThan(0);
      for (const entry of content[language][key]) {
        expect(entry, key).toHaveLength(expectedLength);
        entry.forEach((text) => expect(text.trim(), key).not.toBe(""));
      }
    }
    expect(content[language].features.length).toBeGreaterThan(0);
  });

  test("Hebrew copy avoids restricted professional titles", () => {
    const hebrewCopy = JSON.stringify(content.he);
    expect(hebrewCopy).not.toMatch(/קלינאי|קלינאית|טיפול\s+בדיבור/i);
  });

  test("uses localized names and alphabet examples", () => {
    expect(content.ru).toMatchObject({ siteName: "Тали", letterOne: "А", letterTwo: "Ш" });
    expect(content.he).toMatchObject({ siteName: "טלי", letterOne: "א", letterTwo: "ל" });
  });
});
