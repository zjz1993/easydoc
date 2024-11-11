"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = pluginIndexHtml;
const promises_1 = require("fs/promises");
const constants_1 = require("../constants");
function pluginIndexHtml() {
    return {
        name: "easydoc:index-html",
        apply: "serve",
        transformIndexHtml(html) {
            return {
                html,
                tags: [{
                        tag: 'script',
                        attrs: {
                            type: 'module',
                            src: constants_1.CLIENT_ENTRY_PATH,
                        },
                        injectTo: "body",
                    }]
            };
        },
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    let html = await (0, promises_1.readFile)(constants_1.DEFAULT_HTML_PATH, "utf-8");
                    try {
                        if (typeof req.url === "string") {
                            html = await server.transformIndexHtml(req.url, html, req.originalUrl);
                        }
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.end(html);
                    }
                    catch (e) {
                        return next(e);
                    }
                });
            };
        },
    };
}
