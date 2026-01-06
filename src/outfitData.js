const REQUIRED_GROUPS = ['hair', 'shirts', 'pants', 'shoes']
const REQUIRED_FIELDS = ['id', 'name', 'image']

export function normalizeOutfitData(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Outfit data missing or malformed.')
  }

  const catalog = {}

  REQUIRED_GROUPS.forEach((group) => {
    const options = Array.isArray(payload[group]) ? payload[group] : undefined
    if (!options || !options.length) {
      throw new Error(`Missing ${group} options in outfit data.`)
    }
    catalog[group] = options.map(ensureOptionShape)
  })

  if (!payload.captainBand) {
    throw new Error('Captain band definition missing.')
  }
  catalog.captainBand = ensureOptionShape(payload.captainBand)

  const defaults = payload.defaults || {}
  catalog.defaults = {
    hair: pickDefaultId(catalog.hair, defaults.hair),
    shirts: pickDefaultId(catalog.shirts, defaults.shirts),
    pants: pickDefaultId(catalog.pants, defaults.pants),
    shoes: pickDefaultId(catalog.shoes, defaults.shoes),
    captainBand: typeof defaults.captainBand === 'boolean' ? defaults.captainBand : false
  }

  return catalog
}

export function getDefaultSelections(catalog) {
  if (!catalog || typeof catalog !== 'object') {
    return {
      hair: undefined,
      shirts: undefined,
      pants: undefined,
      shoes: undefined,
      captainBand: false
    }
  }
  return {
    hair: pickDefaultId(catalog.hair, catalog.defaults?.hair),
    shirts: pickDefaultId(catalog.shirts, catalog.defaults?.shirts),
    pants: pickDefaultId(catalog.pants, catalog.defaults?.pants),
    shoes: pickDefaultId(catalog.shoes, catalog.defaults?.shoes),
    captainBand: typeof catalog.defaults?.captainBand === 'boolean' ? catalog.defaults.captainBand : false
  }
}

function ensureOptionShape(option) {
  if (!option || typeof option !== 'object') {
    throw new Error('Invalid outfit option entry.')
  }
  REQUIRED_FIELDS.forEach((field) => {
    const value = option[field]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Outfit option missing ${field}.`)
    }
  })
  return {
    id: option.id,
    name: option.name,
    image: option.image
  }
}

function pickDefaultId(options, desired) {
  if (!Array.isArray(options) || !options.length) {
    return undefined
  }
  if (desired && options.some((option) => option.id === desired)) {
    return desired
  }
  return options[0].id
}
