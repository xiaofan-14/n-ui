import {defineConfig} from 'vite'
import {resolve} from 'path'
import {last,split,first, includes} from "lodash-es";
import dts from "vite-plugin-dts";
import vue from '@vitejs/plugin-vue'
import { hooksPlugin as hooks } from "@learn-ui-to-me/vite-plugins"

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['./**/*.ts'],
      exclude: ['./vite.config.ts']
    }),
    hooks({
      rmFiles: ['./dist'],
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'hooks',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue','lodash-es'],
      output: {
        manualChunks(id) {
          if(includes(id, '/packages/hooks/use'))
            return first(split(last(split(id, '/')), '.'))
        }
      },
    }
  },
})
