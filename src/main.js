import './style.css'
import { loadConfiguratorData } from './lib/data.js'
import { loadAvatarAsset, paintAvatar, decorateSvg } from './lib/avatar.js'
import { state, updateState } from './lib/state.js'

const DEBUG = false
let eventsBound = false
const elements = {}

init()

async function init() {
  renderLoading()

  try {
    const [data, avatar] = await Promise.all([loadConfiguratorData(), loadAvatarAsset()])
    const paletteId = data.palettes[0]?.id
    const backgroundId = data.backgrounds[0]?.id

    updateState({
      data,
      avatar,
      selection: {
        paletteId,
        backgroundId
      }
    })

    renderShell()
    renderControls()
    renderAvatar()
    bindEvents()
  } catch (error) {
    renderShell()
    showError('Unable to initialize the configurator. Please try again.')
    if (DEBUG) {
      console.error(error)
    }
  }
}

function renderLoading() {
  const app = document.querySelector('#app')
  if (!app) {
    return
  }

  app.innerHTML = `
    <div class="loading-screen">
      <span class="text-glow">Loading kits</span>
    </div>
  `
}

function renderShell() {
  const app = document.querySelector('#app')
  if (!app) {
    return
  }

  app.innerHTML = `
    <div class="app-shell">
      <main class="container-xxl">
        <div class="row g-4 align-items-stretch">
          <div class="col-lg-5">
            <section class="control-panel card border-0 shadow h-100">
              <div class="card-body">
                <span class="hero-chip">Monster AIVatar Lab</span>
                <h1 class="hero-title">Outfit Configurator</h1>
                <p class="hero-lede">
                  Blend palettes, atmospheres, and textures to dress the avatar before kickoff.
                </p>
                <div class="mb-4">
                  <label class="form-label" for="kitPalette">Kit Palette</label>
                  <select class="form-select form-select-lg" id="kitPalette" data-select="palette" aria-label="Select kit palette"></select>
                  <p class="selection-helper mt-2" data-selected-palette>Loading palettes...</p>
                </div>
                <div class="mb-4">
                  <label class="form-label" for="stageBackdrop">Stage Atmosphere</label>
                  <select class="form-select" id="stageBackdrop" data-select="background" aria-label="Select stage background"></select>
                  <p class="selection-helper mt-2" data-selected-background>Pick a backdrop to set the scene.</p>
                </div>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <button class="btn btn-ghost" type="button" data-action="shuffle">Shuffle Palette</button>
                  <div class="palette-sample" data-palette-swatch>
                    <span></span>
                    <span data-swatch-label>Preview swatch</span>
                  </div>
                </div>
                <div class="alert alert-warning mt-4 d-none" role="alert" data-role="error"></div>
              </div>
            </section>
          </div>
          <div class="col-lg-7">
            <section class="avatar-panel card border-0 shadow h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge-pill">Live Preview</span>
                  <small class="text-muted" data-preview-label>Awaiting palette...</small>
                </div>
                <div class="avatar-stage" data-stage>
                  <div class="avatar-canvas" data-avatar-canvas>
                    <p class="placeholder">Loading avatar...</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  `

  cacheElements()
}

function cacheElements() {
  const app = document.querySelector('#app')
  elements.paletteSelect = app?.querySelector('[data-select="palette"]')
  elements.backgroundSelect = app?.querySelector('[data-select="background"]')
  elements.paletteDescription = app?.querySelector('[data-selected-palette]')
  elements.backgroundDescription = app?.querySelector('[data-selected-background]')
  elements.paletteSwatch = app?.querySelector('[data-palette-swatch]')
  elements.shuffleButton = app?.querySelector('[data-action="shuffle"]')
  elements.error = app?.querySelector('[data-role="error"]')
  elements.avatarCanvas = app?.querySelector('[data-avatar-canvas]')
  elements.stage = app?.querySelector('[data-stage]')
  elements.previewLabel = app?.querySelector('[data-preview-label]')
}

function renderControls() {
  const paletteSelect = elements.paletteSelect
  const backgroundSelect = elements.backgroundSelect
  const { palettes, backgrounds } = state.data

  if (!paletteSelect || !backgroundSelect) {
    return
  }

  if (!palettes.length || !backgrounds.length) {
    showError('Configurator data is missing required entries.')
    return
  }

  paletteSelect.innerHTML = palettes
    .map((palette) => `<option value="${palette.id}">${palette.label}</option>`)
    .join('')

  if (state.selection.paletteId && palettes.some((palette) => palette.id === state.selection.paletteId)) {
    paletteSelect.value = state.selection.paletteId
  } else {
    const fallback = palettes[0].id
    paletteSelect.value = fallback
    updateState({ selection: { paletteId: fallback } })
  }

  backgroundSelect.innerHTML = backgrounds
    .map((bg) => `<option value="${bg.id}">${bg.label}</option>`)
    .join('')

  if (state.selection.backgroundId && backgrounds.some((bg) => bg.id === state.selection.backgroundId)) {
    backgroundSelect.value = state.selection.backgroundId
  } else {
    const fallback = backgrounds[0].id
    backgroundSelect.value = fallback
    updateState({ selection: { backgroundId: fallback } })
  }

  updatePaletteDescription(getSelectedPalette())
  updateBackgroundDescription(getSelectedBackground())
  setSwatchColor(getSelectedPalette()?.primary)
}

function renderAvatar() {
  const canvas = elements.avatarCanvas
  if (!canvas) {
    return
  }

  const palette = getSelectedPalette()
  const originalSvg = state.avatar.originalSvg

  if (!palette || !originalSvg) {
    canvas.innerHTML = renderPlaceholder('Select a kit palette to style the avatar.')
    return
  }

  const painted = paintAvatar(originalSvg, state.avatar.kitTargets, palette.primary)
  const accessible = decorateSvg(painted, `${palette.label} kit preview`)
  updateState({ renderedSvg: accessible })
  canvas.innerHTML = accessible
  if (elements.previewLabel) {
    elements.previewLabel.textContent = palette.label
  }
  setSwatchColor(palette.primary)
  updatePaletteDescription(palette)
  applyBackground()
  clearError()
}

function renderPlaceholder(message) {
  return `<p class="placeholder">${message}</p>`
}

function applyBackground() {
  const stage = elements.stage
  const background = getSelectedBackground()

  if (!stage || !background) {
    return
  }

  stage.style.setProperty('--stage-from', background.from)
  stage.style.setProperty('--stage-to', background.to)
  updateBackgroundDescription(background)
}

function updatePaletteDescription(palette) {
  if (!elements.paletteDescription) {
    return
  }

  elements.paletteDescription.textContent = palette?.description ?? 'Choose a palette to view its story.'
}

function updateBackgroundDescription(background) {
  if (!elements.backgroundDescription) {
    return
  }

  elements.backgroundDescription.textContent = background?.description ?? 'Select a backdrop to change the stage mood.'
}

function setSwatchColor(color) {
  if (!elements.paletteSwatch) {
    return
  }

  const swatch = elements.paletteSwatch.querySelector('span')
  const label = elements.paletteSwatch.querySelector('[data-swatch-label]')

  if (swatch) {
    swatch.style.setProperty('background', color ?? '#d1d5db')
  }

  if (label) {
    label.textContent = color ? color.toUpperCase() : 'Preview swatch'
  }
}

function bindEvents() {
  if (eventsBound) {
    return
  }

  elements.paletteSelect?.addEventListener('change', handlePaletteChange)
  elements.backgroundSelect?.addEventListener('change', handleBackgroundChange)
  elements.shuffleButton?.addEventListener('click', handleShuffle)
  eventsBound = true
}

function handlePaletteChange(event) {
  const value = event.target.value
  updateState({ selection: { paletteId: value } })
  renderAvatar()
}

function handleBackgroundChange(event) {
  const value = event.target.value
  updateState({ selection: { backgroundId: value } })
  applyBackground()
}

function handleShuffle() {
  const palettes = state.data.palettes
  if (palettes.length <= 1) {
    return
  }

  const currentId = state.selection.paletteId
  const available = palettes.filter((palette) => palette.id !== currentId)
  const random = available[Math.floor(Math.random() * available.length)]
  if (!random) {
    return
  }

  updateState({ selection: { paletteId: random.id } })
  if (elements.paletteSelect) {
    elements.paletteSelect.value = random.id
  }
  renderAvatar()
}

function getSelectedPalette() {
  return state.data.palettes.find((palette) => palette.id === state.selection.paletteId)
}

function getSelectedBackground() {
  return state.data.backgrounds.find((background) => background.id === state.selection.backgroundId)
}

function showError(message) {
  if (!elements.error) {
    return
  }

  elements.error.textContent = message
  elements.error.classList.remove('d-none')
}

function clearError() {
  if (!elements.error) {
    return
  }

  elements.error.classList.add('d-none')
}
