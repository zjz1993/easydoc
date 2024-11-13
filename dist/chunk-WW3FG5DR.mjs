import {
  init_esm_shims
} from "./chunk-D4ATPXQ6.mjs";

// src/node/config.ts
init_esm_shims();
import { resolve } from "path";
import fs from "fs-extra";
import { loadConfigFromFile } from "vite";
function defineConfig(config) {
  return config;
}
function resolveSiteData(userConfig) {
  return {
    title: userConfig.title || "easydoc",
    description: userConfig.description || "\u4E00\u4E2A\u6587\u6863\u7F51\u7AD9"
  };
}
function getUserConfigPath(root) {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    return supportConfigFiles.map((file) => resolve(root, file)).find(fs.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
}
async function resolveUserConfig(root, command, mode) {
  console.log("root\u662F", root);
  const configPath = getUserConfigPath(root);
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  console.log("\u8BFB\u53D6\u7528\u6237\u914D\u7F6E\u7684result\u662F", result);
  if (result) {
    const { config: rawConfig = {} } = result;
    const userConfig = await (typeof rawConfig === "function" ? rawConfig() : rawConfig);
    return [configPath, userConfig];
  } else {
    return [configPath, {}];
  }
}
async function resolveConfig(root, command, mode) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig)
  };
  return siteConfig;
}

export {
  defineConfig,
  resolveConfig
};
