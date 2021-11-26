import React from 'react'

const PHASES = {
  initEntering: {name: 'initEntering', direction: 'enter'},
  entering: {name: 'entering', direction: 'enter'},
  entered: {name: 'entered', direction: 'enter'},
  exiting: {name: 'exiting', direction: 'exit'},
  exited: {name: 'exited', direction: 'exit'},
}

export function useCssTransition(active) {
  const [phase, setPhase] = React.useState(active ? PHASES.entered : PHASES.exited)

  React.useEffect(() => {
    if (phase.name !== 'initEntering') return
    const timeoutId = setTimeout(() => {
      setPhase(phase => phase.name === 'initEntering' ? PHASES.entering : phase)
    })
    return () => clearTimeout(timeoutId)
  }, [phase, setPhase])

  if (active && phase.direction === 'exit') {
    setPhase(PHASES.initEntering)
  }
  if (!active && phase.direction === 'enter') {
    setPhase(PHASES.exiting)
  }

  const endTransition = () => {
    setPhase(phase => {
      if (phase.direction === 'enter') return PHASES.entered
      if (phase.direction === 'exit') return PHASES.exited
    })
  }

  return [phase, endTransition]
}

// When freezeIf is false, the passed-in value will be captured.
// When freezeIf is true, the captured value will be returned instead of the current one.
export function useCapturedValue(value, { freezeIf }) {
  const valueRef = React.useRef(value)
  if (!freezeIf) {
    valueRef.current = value
    return value
  } else {
    return valueRef.current
  }
}