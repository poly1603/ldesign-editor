import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs', 'umd'],
    dir: 'dist',
    name: 'LDesignEditorCore'
  },
  external: [],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
  target: 'es2020',
  globals: {}
})

