import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    cli: 'src/node/cli.ts',
    index: 'src/node/index.ts',
    dev: 'src/node/dev.ts',
  },
  minify: process.env.NODE_ENV === 'production',
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
})
