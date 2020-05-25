import { getPattern, booleanNoop, noop } from './utils'
import { Action, Handlers, Tracker } from './interfaces'

export default function trackingMiddleware(trackers: Array<Tracker> | Tracker) {
  return ({ getState }: any) => (next: Function) => (action: Action) => {
    let transformedAction = action

    for (let tracker of [trackers].flat()) {
      let { transform = noop } = tracker
      let pattern = getPattern(tracker?.pattern || booleanNoop)

      if (pattern(transformedAction)) {
        const eventValue = transform(transformedAction, getState)

        if (tracker?.track) {
          tracker.track(eventValue, getState)
          break
        }

        transformedAction = eventValue
      }
    }

    // pipe(...combine([trackers], getState))({ action, track: null })
    return next(action)
  }
}
