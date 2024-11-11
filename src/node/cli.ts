import { cac } from 'cac'
import { createDevServer } from './dev'
import { build } from './build'

const version = require('../../package.json').version
import path, { resolve } from 'path'
const cli = cac('easydoc').version(version).help()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    console.log('dev', root)
    root = root ? path.resolve(root) : process.cwd()
    const server = await createDevServer(root)
    await server.listen()
    server.printUrls()
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
