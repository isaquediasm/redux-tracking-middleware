import trackingMiddleware, {
  createTracking
} from '../src/redux-tracking-middleware'
import { genericActionCreator } from './utils'
import { createStore, applyMiddleware } from 'redux'

const rootReducer = (state = true, action: any) => {
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
  it('should correctly track events ', () => {
    const track = jest.fn()
    const defaultTracking = createTracking({
      track: (val: any) => val
    })

    const store = configureStore([defaultTracking])

    store.dispatch(genericActionCreator())

    /*  expect(track.mock.calls[0][0]).toEqual(genericActionCreator()) */
  })

  /* it('should correctly filter out events', () => {
    const cb = jest.fn()
    const store = configureStore(cb, { filter: ['GENERIC_'] })

    store.dispatch(genericActionCreator())

    expect(cb.mock.calls.length).toEqual(0)
  })

  it('should correctly customise events based on pattern', () => {
    const cb = jest.fn()
    const store = configureStore(cb, {
      handlers: { GENERIC_: (args: any) => ({ ...args, custom: true }) }
    })

    store.dispatch(genericActionCreator())
    expect(cb.mock.calls[0][0].custom).toBeTruthy()
  }) */
})
