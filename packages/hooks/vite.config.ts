import {defineConfig} from 'vite'
import {resolve} from 'path'
import {last,split,first, includes} from "lodash-es";
import dts from "vite-plugin-dts";
import vue from '@vitejs/plugin-vue'
import { hooksPlugin as hooks } from "@n-ui/vite-plugins"
import vueJsx  from '@vitejs/plugin-vue-jsx'

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
    vueJsx()
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
      external: ['vue','lodash-es', 'vue3-i18n'],
      output: {
        manualChunks(id) {
          if(includes(id, '/packages/hooks/use'))
            return first(split(last(split(id, '/')), '.'))
        }
      },
    }
  },
})
