import { Action, Handlers } from './interfaces'
// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

const noop = (val: Array<any>) => val
const pipe = (...functions: Array<Function>) => (...value: Array<any>) => {
  return functions.reduce((currentValue, currentFunction) => {
    return currentFunction(
      ...(Array.isArray(currentValue) ? currentValue : [currentValue])
    )
  }, value)
}

function track(event: Object) {
  if (!event) return

  console.log('##event', event)
}

function validateByTerm(terms: Array<string>) {
  return (action: Action) => {
    return !terms.some(single => action.type.includes(single)) && action
  }
}

function checkValidateFn(fn: Array<Function> | Function = noop) {
  const validateFn = Array.isArray(fn) ? fn.filter(Boolean) : [fn]
  return validateFn
}

/**
 *
 * @param handlers
 */
function callHandlers(handlers: Handlers) {
  const keys = Object.keys(handlers)

  return (action: Action) => {
    const matchedKey = keys.find(pattern => {
      let regex = new RegExp(pattern, 'gi')

      return action.type.match(regex)
    })

    return matchedKey ? handlers?.[matchedKey](action) : false
  }
}

// should filter out action types containing these strigns
const filterRules = ['LOADING', 'FAILURE']

export function trackingMiddleware(
  onTrack: Function = () => noop,
  config: any = {}
) {
  return () => (next: Function) => (action: Action) => {
    // are we allowed to track this action?
    if (!action.disableTracking) next(action)

    const { handlers, filter = filterRules } = config

    const event = pipe(validateByTerm(filter), callHandlers(handlers))(action)

    if (event) {
      onTrack(event)
    }

    return next(action)
  }
}
