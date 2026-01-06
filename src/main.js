import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
<<<<<<< HEAD
import { normalizeOutfitData, getDefaultSelections } from './outfitData.js'

const selectElements = {
  hair: document.querySelector('[data-select="hair"]'),
  shirts: document.querySelector('[data-select="shirts"]'),
  pants: document.querySelector('[data-select="pants"]'),
  shoes: document.querySelector('[data-select="shoes"]')
}

const layerImages = {
  base: document.querySelector('[data-layer="base"]'),
  hair: document.querySelector('[data-layer="hair"]'),
  shirts: document.querySelector('[data-layer="shirts"]'),
  pants: document.querySelector('[data-layer="pants"]'),
  shoes: document.querySelector('[data-layer="shoes"]'),
  captain: document.querySelector('[data-layer="captain"]')
}

const captainToggle = document.querySelector('[data-captain-toggle]')
const errorBanner = document.querySelector('[data-error]')
const loadingBanner = document.querySelector('[data-loading]')
const statusField = document.querySelector('[data-status]')

const state = {
  hair: undefined,
  shirts: undefined,
  pants: undefined,
  shoes: undefined,
  captainBand: false
}

let catalog

initConfigurator()

async function initConfigurator() {
  toggleLoading(true)
  clearError()
  try {
    catalog = await loadOutfitCatalog()
    populateSelects(catalog)
    applyDefaultSelections()
    wireEvents()
    renderState()
  } catch (error) {
    reportError(error)
  } finally {
    toggleLoading(false)
  }
}

function wireEvents() {
  Object.entries(selectElements).forEach(([category, element]) => {
    if (!element) {
      return
    }
    element.disabled = false
    element.addEventListener('change', (event) => {
      state[category] = event.target.value
      renderState()
    })
  })
  if (captainToggle) {
    captainToggle.disabled = false
    captainToggle.addEventListener('change', (event) => {
      state.captainBand = event.target.checked
      renderState()
=======

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
>>>>>>> origin/dev
    })
  }
}

<<<<<<< HEAD
async function loadOutfitCatalog() {
  const response = await fetch('/data/outfits.json', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Unable to load outfit options. Please refresh.')
  }
  let payload
  try {
    payload = await response.json()
  } catch (error) {
    throw new Error('Invalid outfit data received.')
  }
  return normalizeOutfitData(payload)
}

function populateSelects(data) {
  Object.entries(selectElements).forEach(([category, element]) => {
    if (!element) {
      return
    }
    const options = data[category]
    element.innerHTML = ''
    options.forEach((option) => {
      const node = document.createElement('option')
      node.value = option.id
      node.textContent = option.name
      element.appendChild(node)
    })
  })
  if (layerImages.captain && data.captainBand) {
    layerImages.captain.src = data.captainBand.image
  }
}

function applyDefaultSelections() {
  const defaults = getDefaultSelections(catalog)
  Object.assign(state, defaults)
  Object.entries(selectElements).forEach(([category, element]) => {
    if (element && state[category]) {
      element.value = state[category]
    }
  })
  if (captainToggle) {
    captainToggle.checked = state.captainBand
  }
}

function renderState() {
  renderLayers()
  updateStatus()
}

function renderLayers() {
  Object.keys(selectElements).forEach((category) => {
    setLayerImage(category, state[category])
  })
  if (layerImages.captain) {
    layerImages.captain.classList.toggle('is-visible', Boolean(state.captainBand))
    layerImages.captain.setAttribute('aria-hidden', state.captainBand ? 'false' : 'true')
  }
}

function setLayerImage(category, optionId) {
  const target = layerImages[category]
  if (!target) {
    return
  }
  const option = findOption(category, optionId)
  if (!option) {
    target.removeAttribute('src')
    target.classList.remove('has-image')
    return
  }
  target.src = option.image
  target.classList.add('has-image')
}

function findOption(category, optionId) {
  if (!catalog || !optionId) {
    return undefined
  }
  return catalog[category]?.find((item) => item.id === optionId)
}

function updateStatus() {
  if (!statusField) {
    return
  }
  const categories = ['hair', 'shirts', 'pants', 'shoes']
  const selections = categories
    .map((category) => findOption(category, state[category])?.name)
    .filter(Boolean)
  if (!selections.length) {
    statusField.textContent = 'Pick a palette to see the player update in real time.'
    return
  }
  const description = selections.join(' · ')
  const captainText = state.captainBand ? ' Captain band ready for kickoff.' : ''
  statusField.textContent = `${description}.${captainText}`
}

function reportError(error) {
  if (errorBanner) {
    errorBanner.textContent = error.message
    errorBanner.classList.remove('d-none')
  }
  console.error(error)
  Object.values(selectElements).forEach((element) => {
    if (element) {
      element.disabled = true
    }
  })
  if (captainToggle) {
    captainToggle.disabled = true
  }
}

function clearError() {
  if (!errorBanner) {
    return
  }
  errorBanner.textContent = ''
  errorBanner.classList.add('d-none')
}

function toggleLoading(isLoading) {
  if (!loadingBanner) {
    return
  }
  loadingBanner.classList.toggle('d-none', !isLoading)
}
=======
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
>>>>>>> origin/dev
