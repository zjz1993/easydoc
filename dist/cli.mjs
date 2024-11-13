import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  createDevServer
} from "./chunk-DMWMFRSC.mjs";
import {
  __commonJS,
  resolveConfig
} from "./chunk-GH5USBHB.mjs";

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "easydoc",
      version: "1.0.0",
      main: "dist/index.js",
      bin: {
        easydoc: "bin/digit_doc.js"
      },
      scripts: {
        lint: 'npx eslint "src/**/*.{ts,tsx}" --fix',
        compile: "tsup --watch",
        dev: "bin/digit_doc.js",
        build: "easydoc build docs",
        serve: "cd docs && cd build && serve .",
        prepare: "husky install"
      },
      devDependencies: {
        "@commitlint/cli": "^19.5.0",
        "@commitlint/config-conventional": "^19.5.0",
        "@eslint/compat": "^1.2.2",
        "@eslint/eslintrc": "^3.1.0",
        "@eslint/js": "^9.14.0",
        "@rollup/plugin-typescript": "^12.1.1",
        "@types/fs-extra": "^11.0.4",
        "@types/node": "^22.8.5",
        "@types/react-dom": "^18.3.1",
        "@typescript-eslint/eslint-plugin": "^8.13.0",
        "@typescript-eslint/parser": "^8.13.0",
        commitlint: "^19.5.0",
        eslint: "^9.14.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-jsx-a11y": "^6.10.2",
        "eslint-plugin-prettier": "^5.2.1",
        "eslint-plugin-react": "^7.37.2",
        "eslint-plugin-react-hooks": "^5.0.0",
        globals: "^15.12.0",
        husky: "^9.1.6",
        "lint-staged": "^15.2.10",
        serve: "^14.2.4",
        tsup: "^8.3.5",
        typescript: "^5.5.3"
      },
      private: true,
      author: "",
      license: "ISC",
      description: "",
      dependencies: {
        "@types/react": "^18.3.12",
        "@vitejs/plugin-react": "^4.3.3",
        cac: "^6.7.14",
        "fs-extra": "^11.2.0",
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        vite: "^5.4.10"
      },
      "lint-staged": {
        "*.{ts,tsx}": [
          "eslint --fix"
        ]
      }
    };
  }
});

// src/node/cli.ts
import { cac } from "cac";

// src/node/build.ts
import { build as viteBuild } from "vite";
import pluginReact from "@vitejs/plugin-react";
import { join } from "path";
import fs from "fs-extra";
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    // 注意加上这个插件，自动注入 import React from 'react'，避免 React is not defined 的错误
    plugins: [pluginReact()],
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  });
  console.log(`Building client + server bundles...`);
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      // server build
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
    return [];
  }
}
async function renderPage(render, root, clientBundle) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log(`Rendering page in server side...`);
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
  await fs.ensureDir(join(root, "build"));
  await fs.writeFile(join(root, "build/index.html"), html);
  await fs.remove(join(root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle] = await bundle(root);
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
import path, { resolve } from "path";
var version = require_package().version;
var cli = cac("easydoc").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  const createServer = async () => {
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  console.log("dev", root);
  root = root ? path.resolve(root) : process.cwd();
  const config = await resolveConfig(root, "serve", "development");
  console.log("config\u662F", config);
  await createServer();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
