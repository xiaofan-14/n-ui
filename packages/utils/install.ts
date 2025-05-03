import type {App, Plugin} from 'vue'
import {each}  from 'lodash-es'

type SFCWithInstall<T> = T & Plugin

export function setupInstall(components: Plugin[]) {
    function installer(app: App) {
        each(components, (c: Plugin) => app.use(c))
    }
    return installer as Plugin
}

export function withInstall<T>(component: T){
    (component as SFCWithInstall<T>).install = (app: App) => {
        const name = ( component as any).name
        app.component(name, component as Plugin)
    }

    return component as SFCWithInstall<T>
}
