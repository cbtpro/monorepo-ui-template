import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true,
      exclude: ['src/test/**'],
    }),
  ],

  build: {
    lib: {
      name: 'vue3-ui-template',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
    },
  },
  define: {
    global: 'window',
  },
})
