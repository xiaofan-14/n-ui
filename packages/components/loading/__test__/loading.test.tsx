import { describe, expect, it } from 'vitest'
import { rAF } from '@learn-ui-to-me/utils'
import { Loading } from '../src/service'

describe('Loading', ()=>{
  it('should create Loading Instance',()=>{
    const instance = Loading()
    expect(instance).toBeTruthy()
  })

  it('should render mask', async ()=>{
    Loading()
    await rAF()
    expect(document.querySelector('.er-loading__mask')).toBeTruthy()
  })

  it('should close loading and remove it from DOM', async ()=>{
    const instance  = Loading()
    await rAF()
    expect(document.querySelector('.er-loading')).toBeTruthy()
    instance.close()
    await rAF()
    expect(document.querySelector('.er-loading')).toBeFalsy()
  })
})
