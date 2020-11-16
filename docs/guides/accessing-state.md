# Accessing the redux state

```js
import trackingMiddleware from 'redux-tracking-middleware'

// catches the user information and add it to every action
const getUser = {
  transform: (action, { state }) => {
    const user = state.userReducer.user

    return {
      ...action,
      payload: {
        ...action.payload,
        user
      }
    }
  }
}

const defaultTracking = {
  track: action => {
    Mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware([getUser, defaultTracking])
const store = createStore(
  rootReducer,
  applyMiddleware(tracking.reduxMiddleware)
)
```
