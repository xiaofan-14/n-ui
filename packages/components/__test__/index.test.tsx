import type {Plugin} from 'vue'
import {describe, expect, it} from 'vitest'
import {get, map} from "lodash-es";
import {
  ErAlert,
  ErButton,
  ErCollapse,
  ErIcon,
  ErTooltip
} from '../index'

const comps: Plugin[] = [
  ErAlert,
  ErButton,
  ErCollapse,
  ErIcon,
  ErTooltip
]

describe('components/index', () => {
  it
    .each(map(comps, (c) => [get(c, 'name') ?? '', c]))
    ('%s should be exported', (_, comp) => {
      expect(comp).toBeDefined()
      expect(comp.install).toBeDefined()
    })
})
