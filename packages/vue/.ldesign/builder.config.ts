import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: 'dist',
    name: 'LDesignEditorVue'
  },
  external: ['vue', '@ldesign/editor-core'],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
  target: 'es2020',
  globals: {
    vue: 'Vue',
    '@ldesign/editor-core': 'LDesignEditorCore'
  }
})

