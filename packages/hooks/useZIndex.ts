import { computed, ref } from 'vue'

const zIndex = ref(0)

export default function useZIndex(initCal:number = 2000){
  const _initVal = ref(initCal)
  const currentZIndex = computed(()=>zIndex.value + _initVal.value)

  function nextZIndex(){
    zIndex.value++
    return currentZIndex.value
  }

  return {
    initialValue: _initVal,
    currentZIndex,
    nextZIndex
  }
}
