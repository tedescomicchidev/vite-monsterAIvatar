import { describe, expect, it } from 'vitest'
import { getDefaultSelections, normalizeOutfitData } from './outfitData.js'

const basePayload = {
  hair: [{ id: 'hair-a', name: 'Hair A', image: '/hair-a.png' }],
  shirts: [{ id: 'shirt-a', name: 'Shirt A', image: '/shirt-a.png' }],
  pants: [{ id: 'pants-a', name: 'Pants A', image: '/pants-a.png' }],
  shoes: [{ id: 'shoes-a', name: 'Shoes A', image: '/shoes-a.png' }],
  captainBand: { id: 'captain-band', name: 'Captain Band', image: '/captain.png' },
  defaults: {
    hair: 'hair-a',
    shirts: 'shirt-a',
    pants: 'pants-a',
    shoes: 'shoes-a',
    captainBand: false
  }
}

function buildPayload(overrides = {}) {
  return {
    ...basePayload,
    ...overrides
  }
}

describe('normalizeOutfitData', () => {
  it('normalizes valid payloads and preserves defaults', () => {
    const catalog = normalizeOutfitData(buildPayload())
    expect(catalog.hair[0].id).toBe('hair-a')
    expect(catalog.defaults.hair).toBe('hair-a')
    expect(catalog.captainBand.image).toBe('/captain.png')
  })

  it('throws when required option groups are missing', () => {
    expect(() => normalizeOutfitData(buildPayload({ pants: [] }))).toThrow(/pants/i)
  })
})

describe('getDefaultSelections', () => {
  it('returns catalog defaults when present', () => {
    const catalog = normalizeOutfitData(buildPayload({ defaults: { ...basePayload.defaults, captainBand: true } }))
    const selections = getDefaultSelections(catalog)
    expect(selections.hair).toBe('hair-a')
    expect(selections.captainBand).toBe(true)
  })

  it('falls back to the first option when the desired value is missing', () => {
    const catalog = normalizeOutfitData(
      buildPayload({
        hair: [
          { id: 'hair-a', name: 'Hair A', image: '/hair-a.png' },
          { id: 'hair-b', name: 'Hair B', image: '/hair-b.png' }
        ],
        defaults: { ...basePayload.defaults, hair: 'unknown' }
      })
    )
    const selections = getDefaultSelections(catalog)
    expect(selections.hair).toBe('hair-a')
  })
})
