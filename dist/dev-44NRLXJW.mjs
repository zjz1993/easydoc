import {
  __commonJS,
  __require,
  init_esm_shims
} from "./chunk-D4ATPXQ6.mjs";

// src/node/dev.js
var require_dev = __commonJS({
  "src/node/dev.js"(exports) {
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDevServer = createDevServer;
    var vite_1 = __require("vite");
    async function createDevServer(root = process.cwd()) {
      return (0, vite_1.createServer)({
        root
      });
    }
  }
});
export default require_dev();
