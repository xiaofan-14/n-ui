import { isNumber, isString } from 'lodash-es'
import { debugWarn } from './error'

const SCOPE = 'utils/style'

export function isStringNumber (val: string) {
  if(!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (value === undefined || value === null) {
    return undefined
  }
  if (isNumber(value) || isStringNumber(value as string)) {
    return `${value}${defaultUnit}`
  }
  if(isString(value)) {
    return value
  }
  debugWarn(SCOPE, `binding value must be a number or string`)
}
