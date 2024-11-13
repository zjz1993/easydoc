"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkYCA52VA2js = require('./chunk-YCA52VA2.js');

// src/node/dev.js
var require_dev = _chunkYCA52VA2js.__commonJS.call(void 0, {
  "src/node/dev.js"(exports) {
    _chunkYCA52VA2js.init_cjs_shims.call(void 0, );
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDevServer = createDevServer;
    var vite_1 = _chunkYCA52VA2js.__require.call(void 0, "vite");
    async function createDevServer(root = process.cwd()) {
      return (0, vite_1.createServer)({
        root
      });
    }
  }
});
exports. default = require_dev();
