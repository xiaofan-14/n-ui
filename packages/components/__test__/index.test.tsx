import type {Plugin} from 'vue'
import {describe, expect, it} from 'vitest'
import {ErAlert, ErButton, ErCollapse, ErIcon} from '../'
import {get, map} from "lodash-es";

const comps: Plugin[] = [
  ErAlert,
  ErButton,
  ErCollapse,
  ErIcon
]

describe('components/index', () => {
  it
    .each(map(comps, (c) => [get(c, 'name') ?? '', c]))
    ('%s should be exported', (_, comp) => {
      expect(comp).toBeDefined()
      expect(comp.install).toBeDefined()
    })
})
