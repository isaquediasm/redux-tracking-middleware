import trackingMiddleware from '../src/redux-tracking-middleware'
import {
  genericActionCreator,
  failureActionCreator,
  GENERIC_ACTION_TYPE
} from './utils'
import { createStore, applyMiddleware } from 'redux'
const initialState = { genericState: true }
const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state
  }
}

function configureStore(config: any) {
  const mockStore = createStore(
    rootReducer,
    applyMiddleware(trackingMiddleware(config))
  )

  return mockStore
}

describe('Redux tracking middleware test', () => {
  it('should correctly call track fn with containing action  ', () => {
    const track = jest.fn()
    const store = configureStore({
      track
    })
    store.dispatch(genericActionCreator())

    // first arg should be the action
    expect(track.mock.calls[0][0]).toEqual(genericActionCreator())
    // second arg should be the getState method
    expect(track.mock.calls[0][1].name).toEqual('getState')
  })

  it('should corretly call track fn with getState', () => {
    const track = jest.fn()
    const store = configureStore({
      track
    })
    store.dispatch(genericActionCreator())

    // second arg should be the getState method
    expect(track.mock.calls[0][1].name).toEqual('getState')
    expect(track.mock.calls[0][1]()).toEqual(initialState)
  })

  it('should correctly filter out events', () => {
    const track = jest.fn()
    const store = configureStore({
      pattern: (action: any) => !action.type.includes(`GENERIC`),
      track
    })

    store.dispatch(genericActionCreator())

    // the track fn should not have been called at all
    expect(track.mock.calls.length).toEqual(0)
  })

  it('should correctly customise events based on pattern', () => {
    const track = jest.fn()
    const store = configureStore({
      transform: (action: any, getState: Function) => {
        return {
          ...action,
          custom: true
        }
      },
      track
    })

    store.dispatch(genericActionCreator())
    expect(track.mock.calls[0][0].custom).toBeTruthy()
  })

  it('should correctly combine pattern, transform and track', () => {
    const track = jest.fn()
    const store = configureStore({
      pattern: `GENERIC`,
      transform: (action: any, getState: Function) => {
        return {
          ...action,
          custom: true
        }
      },
      track
    })

    // call multiple actions so we can test the filtering
    store.dispatch(failureActionCreator())
    store.dispatch(genericActionCreator())

    // checks if filtering worked
    expect(track.mock.calls.length).toBe(1)
    expect(track.mock.calls[0][0].type).toBe(GENERIC_ACTION_TYPE)

    // checks if transforming worked
    expect(track.mock.calls[0][0].custom).toBeTruthy()
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

      { track }
    ])

    store.dispatch(failureActionCreator())
    store.dispatch(genericActionCreator())

    console.log(track.mock.calls)
    console.log(trackFailure.mock.calls)
  })
})
