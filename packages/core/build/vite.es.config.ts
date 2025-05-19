import {defineConfig} from 'vite'
import {resolve} from 'path'
import {readdir, readdirSync} from "fs";
import {defer, delay, filter, map} from "lodash-es";
import shell from "shelljs";
import dts from "vite-plugin-dts";
import vue from '@vitejs/plugin-vue'
import terser from '@rollup/plugin-terser'
import { visualizer } from "rollup-plugin-visualizer"
import { hooksPlugin as hooks } from "@learn-ui-to-me/vite-plugins"

const TRY_MOVE_STYLE_DELAY = 800

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, {withFileTypes: true});

  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}

function moveStyles() {
  readdir('./dist/esm/them', (err) => {
    if (err) return delay(moveStyles, TRY_MOVE_STYLE_DELAY)
    defer(() => shell.mv('./dist/esm/theme', './dist'))
  })
}

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.es.html'
    }),
    dts({
      tsconfigPath: '../../tsconfig.build.json',
      outDir: 'dist/types'
    }),
    hooks({
      rmFiles: ['./dist/ems', './dist/theme', './dist/types'],
      afterBuild: moveStyles
    }),
    terser({
      compress: {
        sequences: isProd,
        arguments: isProd,
        drop_console: isProd && ["log"],
        drop_debugger: isProd,
        passes: isProd ? 4 : 1,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest),
        },
      },
      format: {
        semicolons: false,
        shorthand: isProd,
        braces: !isProd,
        beautify: !isProd,
        comments: !isProd,
      },
      mangle: {
        toplevel: isProd,
        eval: isProd,
        keep_classnames: isDev,
        keep_fnames: isDev,
      },
    })
  ],
  build: {
    outDir: 'dist/esm',
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, '../index.ts'),
      name: 'LearnUI',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        '@poperjs/core',
        'async-validator'
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name === 'style.css') return 'index.css'
          if (assetInfo.type === 'asset' && /\.(css)$/i.test(assetInfo.name as string))
            return `theme/[name].[ext]`
          return assetInfo?.name as string
        },
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (
            id.includes('/packages/hooks') || id.includes('plugin-vue:export-helper')
          ) return 'hooks'
          if (id.includes('/packages/utils')) return 'utils'

          for (const dirName of getDirectoriesSync("../components")) {
            if (id.includes(`/packages/components/${dirName}`)) return dirName
          }
        }
      },
    }
  },
})
