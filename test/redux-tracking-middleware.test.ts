import { Storage } from './../src/helpers/storage'
import { noop, booleanNoop, getPattern } from './../src/helpers/utils'
import trackingMiddleware, {
  useTracking,
  track,
  setRouteContext,
  setContext,
  getContext,
  setAppState,
  getAppState
} from '../src/redux-tracking-middleware'
import {
  genericActionCreator,
  failureActionCreator,
  loadingActionCreator,
  GENERIC_ACTION_TYPE
} from './utils'
import { createStore, applyMiddleware } from 'redux'

class StorageDrive {
  store: {
    [key: string]: any
  }

  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key.toString()] || null
  }

  setItem(key: string, value: any) {
    this.store = {
      ...this.store,
      [key]: value.toString()
    }
  }

  removeItem(key: string) {
    delete this.store[key.toString()]
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new StorageDrive()
})

const genericObj = { foo: 'bar' }
const initialState = { genericState: true }
const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state
  }
}

function configureStore(config: any) {
  const tracking = trackingMiddleware(config)

  const mockStore = createStore(
    rootReducer,
    applyMiddleware(tracking.reduxMiddleware)
  )

  return mockStore
}

describe('global tracking middleware test', () => {
  it('should track event', () => {
    const trackFn = jest.fn()
    configureStore({ track: trackFn })

    track(GENERIC_ACTION_TYPE)

    expect(trackFn.mock.calls[0][0]).toEqual(genericActionCreator())
    expect(trackFn.mock.calls[0][1]).toEqual({ state: null, context: null })
  })
})

describe('Redux tracking middleware test', () => {
  it('should correctly call track fn with containing action  ', () => {
    const track = jest.fn()
    const store = configureStore({
      track
    })
    store.dispatch(genericActionCreator())

    // first arg should be the action
    expect(track.mock.calls[0][0]).toEqual(genericActionCreator())
  })

  it('should corretly call track fn with getState', () => {
    const track = jest.fn()
    const store = configureStore({
      track
    })
    store.dispatch(genericActionCreator())

    // second arg should be the state object
    expect(track.mock.calls[0][1]).toEqual({
      state: initialState,
      context: null
    })
  })

  it('should correctly filter out specifc events and keep the rest', () => {
    const track = jest.fn()
    const store = configureStore([
      {
        filter: (action: any) => !action.type.includes(`GENERIC`)
      },
      { track }
    ])

    store.dispatch(genericActionCreator())
    store.dispatch(failureActionCreator())

    // the track fn should not have been called at all
    expect(track.mock.calls.length).toEqual(1)
    expect(track.mock.calls[0][0]).toEqual(failureActionCreator())
  })

  it('should correctly customise events based on pattern', () => {
    const track = jest.fn()
    const trackSplittedTrackers = jest.fn()

    const store = configureStore({
      pattern: `GENERIC`,
      transform: (action: any, state: any) => {
        return {
          ...action,
          custom: true
        }
      },
      track
    })

    const storeWithSplittedTrackers = configureStore([
      {
        pattern: `GENERIC`,
        transform: (action: any, state: any) => {
          return {
            ...action,
            custom: true
          }
        }
      },
      {
        pattern: `FAILURE`,
        transform: (action: any) => ({
          ...action,
          customFailure: true
        })
      },
      {
        track: trackSplittedTrackers
      }
    ])

    // should work for rules in the same tracker
    store.dispatch(genericActionCreator())
    store.dispatch(failureActionCreator())

    expect(track.mock.calls.length).toBe(1)
    expect(track.mock.calls[0][0].custom).toBeTruthy()

    // should work for rules spreaded in different trackers
    storeWithSplittedTrackers.dispatch(genericActionCreator())
    storeWithSplittedTrackers.dispatch(failureActionCreator())

    expect(trackSplittedTrackers.mock.calls.length).toBe(2)
    expect(trackSplittedTrackers.mock.calls[0][0].custom).toBeTruthy()
    expect(trackSplittedTrackers.mock.calls[1][0].customFailure).toBeTruthy()
  })

  it('should correctly combine filter, pattern, transform and track in same tracker', () => {
    const track = jest.fn()
    const trackSplittedTrackers = jest.fn()

    const store = configureStore({
      filter: (action: any) => !action.type.includes(`FAILURE`),
      pattern: `GENERIC`,
      transform: (action: any, state: any) => {
        return {
          ...action,
          custom: true
        }
      },
      track
    })

    const storeWithSplittedTrackers = configureStore([
      { filter: (action: any) => !action.type.includes(`FAILURE`) },
      {
        pattern: `GENERIC`,
        transform: (action: any, state: any) => {
          return {
            ...action,
            custom: true
          }
        }
      },
      {
        track: trackSplittedTrackers
      }
    ])

    // call multiple actions so we can test the filtering
    store.dispatch(failureActionCreator())
    store.dispatch(genericActionCreator())

    // checks if filtering worked
    expect(track.mock.calls.length).toBe(1)
    expect(track.mock.calls[0][0].type).toBe(GENERIC_ACTION_TYPE)

    // checks if transforming worked
    expect(track.mock.calls[0][0].custom).toBeTruthy()

    // should work for rules spreaded in different trackers
    storeWithSplittedTrackers.dispatch(genericActionCreator())
    storeWithSplittedTrackers.dispatch(failureActionCreator())

    // checks if filtering worked
    expect(trackSplittedTrackers.mock.calls.length).toBe(1)
    expect(trackSplittedTrackers.mock.calls[0][0].type).toBe(
      GENERIC_ACTION_TYPE
    )

    console.log(trackSplittedTrackers.mock.calls)
    // checks if transforming worked
    expect(trackSplittedTrackers.mock.calls[0][0].custom).toBeTruthy()
  })

  it('should correcty combine multiple trackers', () => {
    const track = jest.fn()
    const trackFailure = jest.fn()
    const store = configureStore([
      {
        pattern: `GENERIC`,
        transform: (action: any) => {
          return {
            ...action,
            custom: true
          }
        }
      },
      {
        pattern: `LOADING`,
        transform: (action: any) => {
          return {
            ...action,
            loading: true
          }
        }
      },
      {
        pattern: `FAILURE`,
        transform: (action: any) => {
          return {
            ...action,
            failed: true
          }
        },
        track: trackFailure
      },
      { track }
    ])

    store.dispatch(failureActionCreator())
    store.dispatch(genericActionCreator())
    store.dispatch(loadingActionCreator())

    expect(track.mock.calls).toHaveLength(2)
    expect(track.mock.calls[0][0]).toEqual({
      ...genericActionCreator(),
      custom: true
    })

    expect(track.mock.calls[1][0]).toEqual({
      ...loadingActionCreator(),
      loading: true
    })

    expect(trackFailure.mock.calls).toHaveLength(1)
    expect(trackFailure.mock.calls[0][0]).toEqual({
      ...failureActionCreator(),
      failed: true
    })
  })
})

describe('useTracking()', () => {
  it('setContext() should store the given value', () => {
    setContext(genericObj)
    expect(getContext()).toEqual(genericObj)
  })

  it('setAppState() should store the given value ', () => {
    setAppState(genericObj)
    expect(getAppState()).toEqual(genericObj)
  })

  it('setRouteContext() should add the current route to the context', () => {
    const route = { page: 'x' }
    setContext(genericObj)
    setRouteContext(route)
    expect(getContext()).toEqual({ ...genericObj, route })
  })
})

describe('utils tests', () => {
  it('noop() should correctly return value', () => {
    expect(noop(1)).toEqual(1)
    expect(booleanNoop(1)).toBeTruthy()
  })

  it('getPattern() should correctly return a pattern checking fn', () => {
    const fn = function fnPattern() {}
    const fnPattern = getPattern(fn)
    const regexPattern = getPattern(`TEST`)

    // it should return the passed fn
    expect(fnPattern).toBeInstanceOf(Function)
    expect(fnPattern.name).toBe('fnPattern')

    // it should return a fn wrapping a regex match
    expect(regexPattern).toBeInstanceOf(Function)
    expect(regexPattern({ type: 'TEST_ACTION' })).toBeTruthy()
  })

  it('storage() should correctly save and load data', () => {
    const State = new Storage('storage')

    State.save(genericObj)

    expect(State.get()).toEqual(genericObj)
  })
})
