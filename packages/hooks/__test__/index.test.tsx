import {describe, expect, it} from 'vitest'
import { useClickOutSide, useEventListener } from '../'

describe('hooks/index',()=>{
  it('useEventListener should be exported',()=>{
    expect(useEventListener).toBeDefined()
  })
  it('useClickOutSide should be exported',()=>{
    expect(useClickOutSide).toBeDefined()
  })
})
