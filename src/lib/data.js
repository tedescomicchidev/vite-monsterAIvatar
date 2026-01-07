const DATA_URL = '/data/outfits.json'

export async function loadConfiguratorData() {
  const response = await fetch(DATA_URL)
  if (!response.ok) {
    throw new Error('Unable to load outfit data')
  }

  const payload = await response.json()
  const palettes = validateEntries(payload.palettes, ['id', 'label', 'primary'])
  const backgrounds = validateEntries(payload.backgrounds, ['id', 'label', 'from', 'to'])

  if (!palettes.length || !backgrounds.length) {
    throw new Error('Configurator data is incomplete')
  }

  return { palettes, backgrounds }
}

function validateEntries(entries, requiredKeys) {
  if (!Array.isArray(entries)) {
    return []
  }

  return entries.filter((entry) => {
    if (typeof entry !== 'object' || !entry) {
      return false
    }

    return requiredKeys.every((key) => typeof entry[key] === 'string' && entry[key].trim().length > 0)
  })
}
