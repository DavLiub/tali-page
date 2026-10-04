import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { HtmlValidate } from "html-validate";
import { readProjectFile } from "../helpers/load-site.js";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const requiredFiles = [
  "index.html", "assets/css/theme.css", "assets/css/site.css",
  "assets/js/config.js", "assets/js/content.js", "assets/js/site.js"
];

describe("architecture guards", () => {
  test("required layers and entry points exist", () => {
    requiredFiles.forEach((file) => expect(fs.existsSync(path.join(projectRoot, file)), file).toBe(true));
  });

  test("HTML keeps styles and behavior in separate files", () => {
    const html = readProjectFile("index.html");
    expect(html).not.toMatch(/<style[\s>]/i);
    expect(html).not.toMatch(/\sstyle\s*=/i);
    expect(html).not.toMatch(/<script(?![^>]+\bsrc=)[^>]*>/i);
  });

  test("configuration and content layers have no browser behavior", () => {
    for (const file of ["assets/js/config.js", "assets/js/content.js"]) {
      const source = readProjectFile(file);
      expect(source, file).not.toMatch(/\bdocument\b|\bfetch\b|\bXMLHttpRequest\b|\blocalStorage\b/);
    }
  });

  test("source-controlled filenames use lowercase kebab case", () => {
    const files = fs.readdirSync(path.join(projectRoot, "assets"), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    files.forEach((name) => expect(name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/));
  });

  test("repository contains no common secret files", () => {
    const forbiddenNames = [".env", "id_rsa", "id_ed25519"];
    const trackedFiles = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8") + requiredFiles.map(readProjectFile).join("\n");
    forbiddenNames.forEach((name) => expect(fs.existsSync(path.join(projectRoot, name)), name).toBe(false));
    expect(trackedFiles).not.toMatch(/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/);
  });

  test("HTML is structurally valid", async () => {
    const validator = new HtmlValidate({ extends: ["html-validate:recommended"], rules: { "no-inline-style": "error" } });
    const report = await validator.validateString(readProjectFile("index.html"));
    expect(report.results.flatMap((result) => result.messages)).toEqual([]);
  });
});
