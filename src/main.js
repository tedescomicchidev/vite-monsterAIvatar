import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

const DATA_URL = '/data/outfits.json'
const BASE_LAYER_SRC = '/assets/base/body.png'
const BLANK_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const REQUIRED_CATEGORIES = ['shirts', 'shorts', 'shoes']
const REQUIRED_FIELDS = ['id', 'name', 'image']

const selectElements = {
  shirts: document.querySelector('[data-select="shirts"]'),
  shorts: document.querySelector('[data-select="shorts"]'),
  shoes: document.querySelector('[data-select="shoes"]'),
}

const avatarLayers = {
  base: document.querySelector('[data-avatar-base]'),
  shirts: document.querySelector('[data-avatar-shirt]'),
  shorts: document.querySelector('[data-avatar-shorts]'),
  shoes: document.querySelector('[data-avatar-shoes]'),
}

const statusElement = document.querySelector('[data-status]')
const selections = {
  shirts: undefined,
  shorts: undefined,
  shoes: undefined,
}
let outfitCatalog = {
  shirts: [],
  shorts: [],
  shoes: [],
}

const ensureElementsPresent = () => {
  if (!statusElement) {
    throw new Error('Status element missing from DOM')
  }
  for (const category of REQUIRED_CATEGORIES) {
    if (!selectElements[category]) {
      throw new Error(`Missing select element for ${category}`)
    }
    if (!avatarLayers[category]) {
      throw new Error(`Missing avatar layer for ${category}`)
    }
  }
}

const showStatus = (message, isError = false) => {
  statusElement.textContent = message
  statusElement.classList.toggle('is-error', isError)
}

const disableControls = () => {
  Object.values(selectElements).forEach((select) => {
    if (select) {
      select.disabled = true
    }
  })
}

const validateCatalog = (payload) => {
  for (const category of REQUIRED_CATEGORIES) {
    const list = payload[category]
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error(`Missing ${category} options`)
    }
    list.forEach((item) => {
      for (const field of REQUIRED_FIELDS) {
        const value = item[field]
        if (typeof value !== 'string' || value.trim().length === 0) {
          throw new Error(`Invalid ${category} entry: ${field}`)
        }
      }
    })
  }
}

const loadOutfitCatalog = async () => {
  const response = await fetch(DATA_URL)
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }
  const payload = await response.json()
  validateCatalog(payload)
  return payload
}

const renderOptions = (category, items) => {
  const select = selectElements[category]
  if (!select) {
    return
  }
  select.innerHTML = ''
  items.forEach((item) => {
    const option = document.createElement('option')
    option.value = item.id
    option.textContent = item.name
    select.append(option)
  })
}

const setLayer = (category, item) => {
  const layer = avatarLayers[category]
  if (!layer) {
    return
  }
  if (!item) {
    layer.dataset.visible = 'false'
    layer.alt = `No ${category}`
    layer.src = BLANK_SRC
    return
  }
  layer.dataset.visible = 'true'
  layer.alt = item.name
  if (layer.src !== item.image) {
    layer.src = item.image
  }
}

const applySelection = (category, itemId) => {
  const entry = outfitCatalog[category].find((item) => item.id === itemId)
  selections[category] = entry
  setLayer(category, entry)
}

const attachEvents = () => {
  Object.entries(selectElements).forEach(([category, select]) => {
    if (!select) {
      return
    }
    select.addEventListener('change', (event) => {
      applySelection(category, event.target.value)
      showStatus(`Kit updated with ${event.target.options[event.target.selectedIndex].text}.`)
    })
  })
}

const initSelections = () => {
  REQUIRED_CATEGORIES.forEach((category) => {
    const firstItem = outfitCatalog[category][0]
    if (!firstItem) {
      return
    }
    const select = selectElements[category]
    if (select) {
      select.value = firstItem.id
    }
    applySelection(category, firstItem.id)
  })
}

const bootstrapApp = async () => {
  ensureElementsPresent()
  if (avatarLayers.base) {
    avatarLayers.base.src = BASE_LAYER_SRC
    avatarLayers.base.dataset.visible = 'true'
  }
  try {
    showStatus('Loading outfit catalog...')
    outfitCatalog = await loadOutfitCatalog()
    REQUIRED_CATEGORIES.forEach((category) => {
      renderOptions(category, outfitCatalog[category])
    })
    initSelections()
    attachEvents()
    showStatus('Select any layer to remix the kit.')
  } catch (error) {
    console.error(error)
    showStatus('Unable to load outfit options. Please refresh.', true)
    disableControls()
  }
}

bootstrapApp()
