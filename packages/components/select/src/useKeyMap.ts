import type {ComputedRef, Ref} from 'vue'
import type {SelectOptionProps, SelectStates} from "./select.ts"

interface keyMapParams {
  isDropdownVisible: Ref<boolean>
  highlightedLine: ComputedRef<SelectOptionProps | void>
  hasData: ComputedRef<boolean>
  lastIndex: ComputedRef<number>
  selectStates: SelectStates

  controlVisible(visible: boolean): void

  handleSelect(option: SelectOptionProps): void
}

export function useKeyMap(
  {
    isDropdownVisible,
    controlVisible,
    selectStates,
    highlightedLine,
    handleSelect,
    hasData,
    lastIndex
  }: keyMapParams) {

  const keyMap: Map<string, Function> = new Map()
  keyMap.set('Enter', () => {
    if (
      isDropdownVisible.value
      && selectStates.highlightedIndex >= 0
      && highlightedLine.value
    ) {
      handleSelect(highlightedLine.value as SelectOptionProps)
    }

    controlVisible(!isDropdownVisible.value)
  })
  keyMap.set('Escape', () => isDropdownVisible.value && controlVisible(!isDropdownVisible.value))
  keyMap.set('ArrowUp', (e: KeyboardEvent) => {
    e.preventDefault()
    if(!hasData.value) return
    if(selectStates.highlightedIndex === -1 || selectStates.highlightedIndex === 0) {
      selectStates.highlightedIndex = lastIndex.value
      return
    }
    selectStates.highlightedIndex -= 1
  })
  keyMap.set('ArrowDown', (e:KeyboardEvent) => {
    e.preventDefault()
    if(!hasData.value) return
    if(selectStates.highlightedIndex === -1 || selectStates.highlightedIndex === lastIndex.value) {
      selectStates.highlightedIndex = 0
      return
    }
    selectStates.highlightedIndex += 1
  })
  return keyMap
}
