import { Storage } from './helpers/storage'
import {
  getPattern,
  booleanNoop,
  noop,
  createContext,
  createState
} from './helpers/utils'
import { Action, Tracker, TrackingService, RouteEvent } from './interfaces'

export function trackingPipeline(trackers: Array<Tracker> | Tracker) {
  return (state: any, action: Action) => {
    const Context = createContext()

    let transformedAction = action
    const context = Context.get()

    // stores the current application state
    setAppState(state)

    for (let tracker of [trackers].flat()) {
      const { transform = noop } = tracker
      const eventArgs = [transformedAction, { state, context }]

      // checks if the provided pattern is a regex or a fn
      const pattern = getPattern(tracker?.pattern || booleanNoop)
      const filter = getPattern(tracker?.filter || booleanNoop)

      if (tracker.filter && !filter(transformedAction)) {
        break
      }

      // checks if the current action matches the given pattern
      if (tracker.pattern && pattern(transformedAction)) {
        transformedAction = transform(...eventArgs)

        if (tracker?.track) {
          tracker.track(transformedAction, state)

          // break the loop whenever a track method is found
          break
        }
      }

      if (!tracker.pattern && tracker?.track) {
        tracker.track(...eventArgs)

        // break the loop whenever a track method is found
        break
      }
    }
  }
}

export function reduxMiddleware(sendToPipeline: Function) {
  return ({ getState }: any) => (next: Function) => (action: Action) => {
    sendToPipeline(getState(), action)
    return next(action)
  }
}

export function track(type: string, payload: Object = {}) {
  const State = createState()
  const dispatchEvent = trackingPipeline(window.__tracking.trackers)
  const state = State.get()
  const action = { type, payload }
  dispatchEvent(state, action)
}

export default function trackingMiddleware(
  trackers: Array<Tracker> | Tracker
): TrackingService {
  window.__tracking = { trackers }

  const sendToPipeline = trackingPipeline(trackers)

  return {
    reduxMiddleware: reduxMiddleware(sendToPipeline)
  }
}

export function setContext(args: Function | Object) {
  const Context = createContext()
  const currContext = Context.get()
  const newContext = typeof args === 'function' ? args(currContext) : args
  Context.save(newContext)
}

export function getContext() {
  const Context = createContext()
  const currContext = Context.get()

  return currContext
}

export function setAppState(args: Function | Object) {
  const State = createState()
  const currState = State.get()
  const newState = typeof args === 'function' ? args(currState) : args
  State.save(newState)
}

export function getAppState() {
  const State = createState()
  const currState = State.get()
  return currState
}

export function setRouteContext(payload: Object) {
  // track(`${payload.pageName}/LOAD`, payload)

  return setContext((curr: Object) => ({ ...curr, route: payload }))
}

export function useTracking() {
  return {
    setContext,
    getContext,
    setAppState,
    getAppState,
    setRouteContext
  }
}
