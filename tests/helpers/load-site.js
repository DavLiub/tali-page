import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const projectRoot = path.resolve(import.meta.dirname, "../..");

export function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

export function loadDataFiles() {
  const dom = new JSDOM("", { runScripts: "outside-only", url: "https://example.test" });
  dom.window.eval(readProjectFile("assets/js/config.js"));
  dom.window.eval(readProjectFile("assets/js/content.js"));
  return { config: dom.window.SITE_CONFIG, content: dom.window.SITE_CONTENT };
}

export function loadSite(storedLanguage) {
  const dom = new JSDOM(readProjectFile("index.html"), {
    runScripts: "outside-only",
    url: "https://example.test"
  });
  if (storedLanguage) dom.window.localStorage.setItem("tali-language", storedLanguage);
  dom.window.eval(readProjectFile("assets/js/config.js"));
  dom.window.eval(readProjectFile("assets/js/content.js"));
  dom.window.eval(readProjectFile("assets/js/site.js"));
  return dom;
}
