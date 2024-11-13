import { resolve } from 'path'
import fs from 'fs-extra'
import { loadConfigFromFile } from 'vite'
import { SiteConfig, UserConfig } from '@/types/index'
export function defineConfig(config: UserConfig) {
  return config
}
export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'easydoc',
    description: userConfig.description || '一个文档网站',
  }
}
function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js']
    return supportConfigFiles.map((file) => resolve(root, file)).find(fs.pathExistsSync)
  } catch (e) {
    console.error(`Failed to load user config: ${e}`)
    throw e
  }
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production',
) {
  // 之前的配置解析逻辑
  // 1. 获取配置文件路径
  // 2. 读取配置文件的内容
  console.log('root是', root)
  const configPath = getUserConfigPath(root)
  const result = await loadConfigFromFile(
    {
      command,
      mode,
    },
    configPath,
    root,
  )
  console.log('读取用户配置的result是', result)
  if (result) {
    // result长这样
    /**
     *  {
     *   path: '/Users/zhaojunzhe/digit-doc/config.ts',
     *   config: { a: 1 },
     *   dependencies: [ 'config.ts' ]
     * }
     * */
    const { config: rawConfig = {} as unknown } = result
    // 三种情况:
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function' ? rawConfig() : rawConfig)
    return [configPath, userConfig] as const
  } else {
    return [configPath, {} as UserConfig] as const
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production',
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode)
  const siteConfig: SiteConfig = {
    root,
    configPath: configPath,
    siteData: resolveSiteData(userConfig as UserConfig),
  }
  return siteConfig
}
