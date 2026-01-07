const SVG_URL = '/assets/avatar-left.svg'
const CROPPED_VIEWBOX = '1900 320 1100 1700'
const COLOR_PATTERN = /rgb\((\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/g

export async function loadAvatarAsset() {
  const response = await fetch(SVG_URL)
  if (!response.ok) {
    throw new Error('Unable to load avatar asset')
  }

  const raw = await response.text()
  const prepared = cropSvg(raw)
  const kitTargets = collectKitTargets(prepared)

  return {
    originalSvg: prepared,
    kitTargets
  }
}

export function paintAvatar(svgText, kitTargets, hexColor) {
  if (!svgText || !kitTargets?.length || !hexColor) {
    return svgText
  }

  const normalizedHex = normalizeHex(hexColor)
  const luminanceValues = kitTargets.map((target) => target.luminance)
  const minLum = Math.min(...luminanceValues)
  const maxLum = Math.max(...luminanceValues)
  const range = maxLum - minLum || 1

  let output = svgText
  kitTargets.forEach((target) => {
    const normalized = (target.luminance - minLum) / range
    const delta = (normalized - 0.5) * 0.9
    const replacement = adjustColor(normalizedHex, delta)
    output = output.split(target.token).join(replacement)
  })

  return output
}

export function decorateSvg(svgText, label) {
  if (!svgText) {
    return svgText
  }

  if (svgText.includes('role="img"')) {
    return svgText
  }

  const safeLabel = label?.length ? label : 'Avatar preview'
  return svgText.replace('<svg ', `<svg role="img" aria-label="${safeLabel}" `)
}

function cropSvg(svgText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svg = doc.documentElement
  svg.setAttribute('viewBox', CROPPED_VIEWBOX)
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  return new XMLSerializer().serializeToString(doc)
}

function collectKitTargets(svgText) {
  const matches = new Map()
  COLOR_PATTERN.lastIndex = 0
  let match = COLOR_PATTERN.exec(svgText)

  while (match) {
    const [token, rStr, gStr, bStr] = match
    const r = parseFloat(rStr)
    const g = parseFloat(gStr)
    const b = parseFloat(bStr)

    if (r >= 60 && g <= 45 && b <= 45 && !matches.has(token)) {
      const luminance = (r + g + b) / 3
      matches.set(token, { token, luminance })
    }

    match = COLOR_PATTERN.exec(svgText)
  }

  return Array.from(matches.values())
}

function normalizeHex(hex) {
  if (!hex) {
    return '#000000'
  }

  const value = hex.trim().toLowerCase()
  if (value.startsWith('#') && (value.length === 4 || value.length === 7)) {
    if (value.length === 4) {
      return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    }
    return value
  }

  return `#${value}`
}

function adjustColor(hex, delta) {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return hex
  }

  const amount = Math.max(-1, Math.min(1, delta))
  const apply = (channel) => {
    if (amount >= 0) {
      return Math.round(channel + (255 - channel) * amount)
    }
    return Math.round(channel * (1 + amount))
  }

  return rgbToHex({
    r: apply(rgb.r),
    g: apply(rgb.g),
    b: apply(rgb.b)
  })
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex).replace('#', '')
  if (normalized.length !== 6) {
    return undefined
  }

  const value = parseInt(normalized, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  }
}

function rgbToHex({ r, g, b }) {
  return `#${toChannelHex(r)}${toChannelHex(g)}${toChannelHex(b)}`
}

function toChannelHex(value) {
  return value.toString(16).padStart(2, '0')
}
