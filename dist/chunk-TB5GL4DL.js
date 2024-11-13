"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/node/config.ts
var _path = require('path');
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _vite = require('vite');
function defineConfig(config) {
  return config;
}
function getUserConfigPath(root) {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    return supportConfigFiles.map((file) => _path.resolve.call(void 0, root, file)).find(_fsextra2.default.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
}
async function resolveConfig(root, command, mode) {
  console.log("root\u662F", root);
  const configPath = getUserConfigPath(root);
  const result = await _vite.loadConfigFromFile.call(void 0, 
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





exports.__commonJS = __commonJS; exports.defineConfig = defineConfig; exports.resolveConfig = resolveConfig;
