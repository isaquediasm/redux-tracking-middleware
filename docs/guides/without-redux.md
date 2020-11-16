# Using the tracking middleware outside Redux

It is also possible to trigger the middleware from anywhere of your application by calling the `track` method directly.

Consider the example below, where we filter in actions that has a type USER_REGISTERED

```js
const userTracking = {
  pattern: `USER_REGISTERED`,
  transform: action => {
    return {
      ...action,
      type: 'User Registered'
    }
  },
  track: action => {
    Mixpanel.people.set({ plan: action.payload.plan })
    Mixpanel.identify(action.payload.userId)
    Mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware(userTracking)
const store = createStore(
  rootReducer,
  applyMiddleware(tracking.reduxMiddleware)
)
```

If needed, you can also trigger the same tracking definition by calling the track method directly in your component.

```js
import { track } from 'redux-tracking-middleware'

const Registration = () => {
  const handleClick = useCallback(() => {
    track('BUTTON_CLICKED', user)
  }, [track])

  return <button onClick={handleClick}>Submit</button>
}
```

## API Specification

### track(type, payload)
