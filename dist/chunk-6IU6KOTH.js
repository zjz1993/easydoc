"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkAIGGQU7Djs = require('./chunk-AIGGQU7D.js');

// src/node/dev.ts
var _vite = require('vite');
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);

// src/node/plugin/indexHtml.ts
var _promises = require('fs/promises');

// src/node/constants/index.ts
var _path = require('path');
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");
var SERVER_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");

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
          let html = await _promises.readFile.call(void 0, DEFAULT_HTML_PATH, "utf-8");
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
${_path.relative.call(void 0, config.root, ctx.file)} changed, restarting server...`);
          await restartServer();
        }
      }
    }
  };
}

// src/node/dev.ts
async function createDevServer(root = process.cwd(), restartServer) {
  const config = await _chunkAIGGQU7Djs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, ), pluginGetConfig(config, restartServer)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}





exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.createDevServer = createDevServer;
