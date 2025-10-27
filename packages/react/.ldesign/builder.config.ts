import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: 'dist',
    name: 'LDesignEditorReact'
  },
  external: ['react', 'react-dom', '@ldesign/editor-core'],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
  target: 'es2020',
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@ldesign/editor-core': 'LDesignEditorCore'
  }
})

