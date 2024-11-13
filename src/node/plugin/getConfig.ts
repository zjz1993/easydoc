import { relative } from 'path'
import { Plugin } from 'vite'
import { SiteConfig } from '@/types/index'

const SITE_DATA_ID = 'easydoc:site-data'

export function pluginGetConfig(config: SiteConfig, restartServer: () => Promise<void>): Plugin {
  return {
    name: 'easydoc:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    handleHotUpdate: async (ctx) => {
      console.log('热更新触发 handleHotUpdate')
      if (config.configPath) {
        const customWatchedFiles = [config.configPath] as string[]
        const include = (id: string) => customWatchedFiles.some((file) => id.includes(file))
        if (include(ctx.file)) {
          console.log(`\n${relative(config.root, ctx.file)} changed, restarting server...`)
          // 重启 Dev Server
          await restartServer()
        }
      }
    },
  }
}
