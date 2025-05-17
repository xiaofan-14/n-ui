import {isString} from 'lodash-es'

class ErUiError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'ErUiError'
    }
}

function createError(scope: string, msg: string){
  throw new ErUiError(`[${scope}]:${msg}`)
}
export function throwError(scope: string, msg: string){
  createError(scope, msg)
}

export function debugWarn(error: Error):void;
export function debugWarn(scope:string, msg: string):void;

export function debugWarn(scope: string | Error, msg?: string){
    if(process.env.NODE_ENV !== 'production'){
        const err = isString(scope) ? new ErUiError(`[${scope}]:${msg}`) : scope
        console.warn(err)
    }
}
