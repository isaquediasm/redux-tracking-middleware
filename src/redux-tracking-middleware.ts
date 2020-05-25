import { pipe, booleanNoop, noop } from './utils'
import { Action, Handlers, Tracker } from './interfaces'

function createTransformFn(getState: Function) {
  return (options: any) => {
    const { transform = noop } = options
    const pattern = getPattern(options?.pattern || booleanNoop)

    return (action: Action) => {
      return action && pattern(action, getState) && transform(action, getState)
    }
  }
}
function getPattern(pattern: any) {
  return typeof pattern === 'string'
    ? (action: Action): boolean => !!action.type.match(new RegExp(pattern))
    : pattern
}

function combine(config: Array<any>, getState: Function) {
  const trackers = config.flat()
  // returns the first occurrence of track function
  const mainTracker = trackers.find(item => !!item.track)

  console.log('##tracker', mainTracker)
  // wraps and validates the track function
  const trackFn = (action: Action) => {
    if (action) {
      return mainTracker.track(action, getState)
    }
  }

  const transformedActions = trackers.map(createTransformFn(getState))

  return [...transformedActions, trackFn]
}

export default function trackingMiddleware(trackers: Array<Tracker> | Tracker) {
  return ({ getState }: any) => (next: Function) => (action: Action) => {
    let transformedAction = action

    for (let tracker of [trackers].flat()) {
      let { transform = noop } = tracker
      let pattern = getPattern(tracker?.pattern || booleanNoop)

      if (pattern(action)) {
        const eventValue = transform(action, getState)

        if (tracker?.track) {
          tracker.track(eventValue, getState)
          break
        }

        transformedAction = transform(action, getState)
      }
    }

    // pipe(...combine([trackers], getState))({ action, track: null })
    return next(action)
  }
}
