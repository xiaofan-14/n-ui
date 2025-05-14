import {each, isFunction} from 'lodash-es'
import shell from 'shelljs'

export interface pluginProps {
    rmFiles?: string[],
    beforeBuild?: Function,
    afterBuild?: Function
}

export default function hooksPlugin(props: pluginProps) {
    const { rmFiles = [], beforeBuild, afterBuild } = props

    return {
        name: 'hooks-plugin',
        buildStart(){
            each(rmFiles, (fName) =>shell.rm('-rf', fName))
            isFunction(beforeBuild) && beforeBuild()
        },
        buildEnd(err?: Error){
            !err && isFunction(afterBuild) && afterBuild()
        }
    }
}
