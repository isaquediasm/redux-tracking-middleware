import { Action, Handlers, Tracker } from './interfaces'
// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

export const noop = (val: any) => val

const pipe = (...fns: Array<any>) => (x: any) => fns.reduce((v, f) => f(v), x)

/**
 *
 *
 * @param {Array<string>} terms
 * @returns
 */
function validateByTerm(terms: Array<string>) {
  return (action: Action) => {
    return !terms.some(single => action.type.includes(single)) && action
  }
}

/**
 *
 * @param handlers
 */
function callHandlers(handlers: Handlers) {
  const keys = Object.keys(handlers)

  return (action: Action) => {
    if (!keys.length) return action

    const matchedKey = keys.find(pattern => {
      let regex = new RegExp(pattern, 'gi')

      return action.type.match(regex)
    })

    return matchedKey ? handlers?.[matchedKey](action) : action
  }
}

// should filter out action types containing these strigns
const filterRules = ['LOADING', 'FAILURE']

export function createTracking(options: any) {
  return options
}

function combine(trackers: Array<any>) {
  const mainTracker = trackers.find(item => !!item.track)

  return [
    ...trackers.map(options => {
      const { pattern = (val: any) => true, transform = noop } = options

      return (action: Action) => {
        if (!pattern(action)) return

        return transform(action)
      }
    }),
    mainTracker.track
  ]
}

export default function trackingMiddleware(trackers: Array<any>) {
  return () => (next: Function) => (action: Action) => {
    pipe(...combine(trackers))(action)
    return next(action)
  }
}
