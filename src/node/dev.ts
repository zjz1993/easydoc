import { createServer as createViteDevServer } from 'vite'
import { resolveConfig } from '@/node/config'
import pluginReact from '@vitejs/plugin-react'
import { pluginIndexHtml } from './plugin/indexHtml'
import { pluginGetConfig } from '@/node/plugin/getConfig'
import { PACKAGE_ROOT } from '@/node/constants/index'

export async function createDevServer(root = process.cwd(), restartServer: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development')
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginGetConfig(config, restartServer)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  })
}
