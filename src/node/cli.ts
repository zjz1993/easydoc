import { cac } from 'cac'
import { build } from './build'
import { resolveConfig } from '@/node/config'
import { createDevServer } from './dev'

// const version = require('../../package.json').version;
import path, { resolve } from 'path'
const cli = cac('easydoc').version('0.1.0').help()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const createServer = async () => {
      // const { createDevServer } = await import('./dev.js');
      const server = await createDevServer(root, async () => {
        await server.close()
        await createServer()
      })
      await server.listen()
      server.printUrls()
    }
    console.log('dev', root)
    root = root ? path.resolve(root) : process.cwd()
    const config = await resolveConfig(root, 'serve', 'development')
    console.log('config是', config)
    await createServer()
  })

cli.command('build [root]', 'build for production').action(async (root: string) => {
  try {
    root = resolve(root)
    await build(root)
  } catch (e) {
    console.log(e)
  }
})

cli.parse()
