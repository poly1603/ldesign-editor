import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: 'dist',
    name: 'LDesignEditorLit'
  },
  external: ['lit', '@ldesign/editor-core'],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
  target: 'es2020',
  globals: {
    lit: 'Lit',
    '@ldesign/editor-core': 'LDesignEditorCore'
  }
})

