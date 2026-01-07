export const state = {
  data: {
    palettes: [],
    backgrounds: []
  },
  selection: {
    paletteId: undefined,
    backgroundId: undefined
  },
  avatar: {
    originalSvg: undefined,
    kitTargets: []
  },
  renderedSvg: undefined,
  status: 'idle',
  error: undefined
}

export function updateState(partial) {
  if (!partial) {
    return
  }

  if (partial.data) {
    state.data = partial.data
  }

  if (partial.selection) {
    state.selection = { ...state.selection, ...partial.selection }
  }

  if (partial.avatar) {
    state.avatar = { ...state.avatar, ...partial.avatar }
  }

  if (Object.prototype.hasOwnProperty.call(partial, 'renderedSvg')) {
    state.renderedSvg = partial.renderedSvg
  }

  if (partial.status) {
    state.status = partial.status
  }

  if (Object.prototype.hasOwnProperty.call(partial, 'error')) {
    state.error = partial.error
  }
}
