import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
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
    })
  }
}

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
