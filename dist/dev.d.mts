import * as vite from 'vite';

declare function createDevServer(root: string | undefined, restartServer: () => Promise<void>): Promise<vite.ViteDevServer>;

export { createDevServer };
