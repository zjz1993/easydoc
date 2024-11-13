import {
  __dirname,
  resolveConfig
} from "./chunk-GH5USBHB.mjs";

// src/node/dev.ts
import { createServer as createViteDevServer } from "vite";
import pluginReact from "@vitejs/plugin-react";

// src/node/plugin/indexHtml.ts
import { readFile } from "fs/promises";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");
var SERVER_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
var CLIENT_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");

// src/node/plugin/indexHtml.ts
function pluginIndexHtml() {
  return {
    name: "easydoc:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: CLIENT_ENTRY_PATH
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            if (typeof req.url === "string") {
              html = await server.transformIndexHtml(req.url, html, req.originalUrl);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/plugin/getConfig.ts
import { relative } from "path";
var SITE_DATA_ID = "easydoc:site-data";
function pluginGetConfig(config, restartServer) {
  return {
    name: "easydoc:config",
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    handleHotUpdate: async (ctx) => {
      console.log("\u70ED\u66F4\u65B0\u89E6\u53D1 handleHotUpdate");
      if (config.configPath) {
        const customWatchedFiles = [config.configPath];
        const include = (id) => customWatchedFiles.some((file) => id.includes(file));
        if (include(ctx.file)) {
          console.log(`
${relative(config.root, ctx.file)} changed, restarting server...`);
          await restartServer();
        }
      }
    }
  };
}

// src/node/dev.ts
async function createDevServer(root = process.cwd(), restartServer) {
  const config = await resolveConfig(root, "serve", "development");
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginGetConfig(config, restartServer)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}

export {
  SERVER_ENTRY_PATH,
  CLIENT_ENTRY_PATH,
  createDevServer
};
