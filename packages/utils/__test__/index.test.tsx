import { describe, expect, it } from 'vitest'
import {
  debugWarn,
  throwError,
  withInstall,
  setupInstall,
  typeIconMap
} from '../'
import {each} from "lodash-es"

describe('utils/index',()=>{
  it('debugWarn should be exported',()=>{
    expect(debugWarn).toBeDefined()
  })

  it('typeIconMap should be exported',()=>{
    expect(throwError).toBeDefined()
  })

  it('withInstall should be exported',()=>{
    expect(withInstall).toBeDefined()
  })

  it('setupInstall should be exported',()=>{
    expect(setupInstall).toBeDefined()
  })

  it('typeIconMap should be worked',()=>{
    expect(typeIconMap).toBeDefined()
    each([
      ['info','circle-info'],
      ['success','check-circle'],
      ['warning','circle-exclamation'],
      ['danger','circle-xmark'],
      ['error','circle-xmark'],
    ], ([type, icon])=>{
      expect(typeIconMap.get(type)).toBe(icon)
    })
  })
})
