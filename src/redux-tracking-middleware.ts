import { getPattern, booleanNoop, noop } from './utils'
import { Action, Handlers, Tracker } from './interfaces'

export default function trackingMiddleware(trackers: Array<Tracker> | Tracker) {
  return ({ getState }: any) => (next: Function) => (action: Action) => {
    let transformedAction = action

    for (let tracker of [trackers].flat()) {
      const { transform = noop } = tracker

      if (tracker?.filter && !tracker.filter(transformedAction)) {
        break
      }

      // checks if the provided pattern is a regex or a fn
      const pattern = getPattern(tracker?.pattern || booleanNoop)

      // checks if the current action matches the given pattern
      if (tracker.pattern && pattern(transformedAction)) {
        transformedAction = transform(transformedAction, getState)

        if (tracker?.track) {
          tracker.track(transformedAction, getState)

          // break the loop whenever a track method is found
          break
        }
      }

      if (!tracker.pattern && tracker?.track) {
        tracker.track(transformedAction, getState)

        // break the loop whenever a track method is found
        break
      }
    }

    return next(action)
  }
}
