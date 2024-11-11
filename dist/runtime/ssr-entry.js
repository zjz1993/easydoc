"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const jsx_runtime_1 = require("react/jsx-runtime");
const App_1 = require("./App");
const server_1 = require("react-dom/server");
// For ssr component render
function render() {
    return (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(App_1.App, {}));
}
