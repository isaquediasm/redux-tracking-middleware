import { trackingMiddleware } from '../src/redux-tracking-middleware'
import { genericActionCreator } from './utils'
import { createStore, applyMiddleware } from 'redux'

const rootReducer = (state = true, action: any) => {
  switch (action.type) {
    default:
      return state
  }
}

function configureStore(cb: Function, config: any) {
  const mockStore = createStore(
    rootReducer,
    applyMiddleware(trackingMiddleware(cb, config))
  )

  return mockStore
}

describe('Redux tracking middleware test', () => {
  it('should correctly track events ', () => {
    const cb = jest.fn()
    const store = configureStore(cb, {})

    store.dispatch(genericActionCreator())

    expect(cb.mock.calls[0][0]).toEqual(genericActionCreator())
  })

  it('should correctly filter out events', () => {
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
  })
})
