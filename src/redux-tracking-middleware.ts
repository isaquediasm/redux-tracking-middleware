import { getPattern, booleanNoop, noop } from './utils'
import {
  Action,
  Handlers,
  Tracker,
  TrackingService,
  StateStorage,
  StorageDrive
} from './interfaces'

function findAvailableStorage() {
  return localStorage
}

declare global {
  interface Window {
    __tracking: any
  }
}

const prefix = '__tracking'
class Storage {
  storage: StorageDrive
  key: string

  constructor(key: string, storage: StorageDrive = findAvailableStorage()) {
    console.log('##drive', localStorage)
    this.storage = storage
    this.key = `${prefix}-${key}`
  }

  save(value: any) {
    this.storage.setItem(this.key, JSON.stringify(value))
  }

  get() {
    const val = this.storage.getItem(this.key)

    return val ? JSON.parse(val) : null
  }
}

const State = new Storage('state')
const Context = new Storage('context')

export function setContext(args: Function | Object) {
  const currContext = Context.get()
  const newContext = typeof args === 'function' ? args(currContext) : args
  Context.save(newContext)
}

export function setAppState(args: Function | Object) {
  const currContext = State.get()
  const newContext = typeof args === 'function' ? args(currContext) : args
  Context.save(newContext)
}

export function setRouteContext(args: Function | Object) {
  return setContext((curr: Object) => ({ ...curr, route: args }))
}

export function useTracking() {
  return {
    setContext,
    setAppState,
    setRouteContext
  }
}

export function trackingPipeline(trackers: Array<Tracker> | Tracker) {
  return (state: any, action: Action) => {
    let transformedAction = action

    setAppState(state)

    for (let tracker of [trackers].flat()) {
      const { transform = noop } = tracker

      if (tracker?.filter && !tracker.filter(transformedAction)) {
        break
      }

      // checks if the provided pattern is a regex or a fn
      const pattern = getPattern(tracker?.pattern || booleanNoop)

      // checks if the current action matches the given pattern
      if (tracker.pattern && pattern(transformedAction)) {
        transformedAction = transform(transformedAction, state)

        if (tracker?.track) {
          tracker.track(transformedAction, state)

          // break the loop whenever a track method is found
          break
        }
      }

      if (!tracker.pattern && tracker?.track) {
        tracker.track(transformedAction, state)

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

export function track(type: string, payload: any) {
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
