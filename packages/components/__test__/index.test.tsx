import type {Plugin} from 'vue'
import {describe, expect, it} from 'vitest'
import {get, map} from "lodash-es";
import {
  NAlert,
  NButton,
  NCollapse,
  NIcon,
  NTooltip
} from '../index'

const comps: Plugin[] = [
  NAlert,
  NButton,
  NCollapse,
  NIcon,
  NTooltip
]

describe('components/index', () => {
  it
    .each(map(comps, (c) => [get(c, 'name') ?? '', c]))
    ('%s should be exported', (_, comp) => {
      expect(comp).toBeDefined()
      expect(comp.install).toBeDefined()
    })
})
