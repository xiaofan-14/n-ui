import English from '@n-ui/locale/lang/en'
import { merge } from 'lodash-es'
import { computed, getCurrentInstance, inject, provide, ref, unref, watch } from 'vue'
import { configProviderContextKey } from './constants'
import { debugWarn } from '@n-ui/utils'
import { createI18n, i18nSymbol } from 'vue3-i18n'
import type { configProviderContext } from './constants'
import type { MaybeRef, Ref, App } from 'vue'
import type { configProviderProps } from './types'
import type { TranslatePair } from '@n-ui/locale'

const globalConfig = ref<configProviderProps>()

export function useGlobalConfig<
  K extends keyof configProviderContext,
  D extends configProviderContext[K]
>(key: K, defaultVal?: D): Ref<Exclude<configProviderContext[K], void>>;

export function useGlobalConfig(): Ref<configProviderContext>;

export function useGlobalConfig(
  key?: keyof configProviderContext,
  defaultVal = void 0
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig

  return key ? computed(() => config.value?.[key] ?? defaultVal) : config
}

function _createI18n(opts?: configProviderContext) {
  const mergeMsg = (msg: TranslatePair) => merge(msg, opts?.extendsI18nMsg ?? {})

  if (!opts?.locale) {
    return createI18n({
      locale: 'en',
      messages: mergeMsg({
        en: English.el
      })
    })
  }
  return createI18n({
    locale: opts.locale?.name || 'en',
    messages: mergeMsg({
      en: English.el,
      [opts.locale?.name]: opts.locale?.el || {}
    })
  })
}

export function provideGlobalConfig(
  config: MaybeRef<configProviderContext> = { locale: English },
  app?: App,
  global = false
) {
  const instance = getCurrentInstance()
  const oldCfg = instance ? useGlobalConfig() : void 0
  const provideFn = app?.provide ?? (instance ? provide : void 0)

  if (!provideFn) {
    debugWarn('provideGlobalConfig', 'provideGlobalConfig() can only be used inside setup()')
  }

  const context = ref(unref(config))
  watch(()=>config,
  (val)=>{
    const cfg = unref(val)
    if(!oldCfg?.value) return cfg
    context.value = merge(oldCfg.value, cfg)
  },
{deep: true})

  const i18n = ref(_createI18n(context.value));
  watch(
    () => context.value,
    (val) => (i18n.value = _createI18n(val)),
    { deep: true }
  );

  provide(configProviderContextKey, context)
  provide(i18nSymbol, i18n)

  if(app) app.use(i18n.value)
  if(global || !globalConfig.value) globalConfig.value = context.value

  return context
}
