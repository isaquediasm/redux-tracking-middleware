# Customising actions

Consider the following actions, where you register an user, and in this scenario you need to register this user to your tracking solution and finally customise the shape of the event that will be dispatched to your tracking provider:

```js
{
  type: 'APP/USER_REGISTERED',
  payload: {
    userId: 1,
    firstName: 'Darth',
    lastName: 'Vader',
    role: 'admin',
    plan: 'premium',
    contractValue: 999.99
  }
}
```

In that case , you'd need to specify these rules using the property `customise` of the options object, which accepts an array of objects containing an RegEx pattern or a function to match the action and a `onTrack` callback function.

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
