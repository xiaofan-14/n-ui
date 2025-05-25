import { describe, expect, it } from 'vitest'
import {nextTick} from 'vue'
import { message, closeAll } from '../src/methods'

const rAF = async () => {
  return new Promise((res)=>{
    requestAnimationFrame(()=>{
      requestAnimationFrame(async ()=>{
        res(null)
        await nextTick
      })
    })
  })
}

function getTopValue(element: Element){
  const styles = window.getComputedStyle(element)
  const topValue =styles.getPropertyValue('top')
  return Number.parseFloat(topValue)
}

describe('Message', ()=>{
  it('message() function', async()=>{
    const handler = message({ message: 'hello msg', duration: 0 })
    await rAF()
    expect(document.querySelector('.er-message')).toBeTruthy()
    handler.close()
    await rAF()
    expect(document.querySelector('.er-message')).toBeFalsy()
  })

  it('call messag() function mor than once', async ()=>{
    message({ message:'hello msg', duration: 0})
    message({ message:'hello msg2', duration: 0})
    await rAF()
    expect(document.querySelectorAll('.er-message').length).toBe(2)
    closeAll()
    await rAF()
    expect(document.querySelector('.er-message')).toBeFalsy()
  })

  it('message offset', ()=>{
    message({
      message:'hello msg',
      duration: 0
    })
    const wrapper = document.querySelector('.er-message')
    getTopValue(wrapper as HTMLElement)
  })
})
