import {
  __dirname,
  init_esm_shims
} from "./chunk-D4ATPXQ6.mjs";

// src/node/constants/index.ts
init_esm_shims();
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");
var SERVER_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
var CLIENT_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");

export {
  PACKAGE_ROOT,
  DEFAULT_HTML_PATH,
  SERVER_ENTRY_PATH,
  CLIENT_ENTRY_PATH
};
