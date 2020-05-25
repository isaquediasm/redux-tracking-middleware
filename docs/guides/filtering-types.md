# Filtering Event Types

The property `pattern` of the options object, which accepts a regex or a function allows you to filter in or out certain action types based on your own rules.

```js
const defaultTrack = {
  pattern: action => action.type.includes('FAILED'), // only failed actions
  track: action => {
    Sentry.captureException(action.error)
  }
}
```

Or the following example:

```js
const defaultTracking = {
  // all actions where allowTracking is true,
  pattern: action => action.allowTracking === true,
  track: action => {
    mixpanel.track(action.type, action.payload)
  }
}
```
