# Redux tracking middleware [![Build Status](https://travis-ci.com/isaquediasm/redux-tracking-middleware.svg?branch=master)](https://travis-ci.com/isaquediasm/redux-tracking-middleware) [![Size Status](https://img.shields.io/bundlephobia/min/redux-tracking-middleware)](https://img.shields.io/bundlephobia/min/redux-tracking-middleware)

Redux Tracking Middleware uses the power of middlewares to enable a simple and robust way to handle action/event tracking in your application.

- [Redux tracking middleware ![Build Status](https://travis-ci.com/isaquediasm/redux-tracking-middleware)](#redux-tracking-middleware-img-srchttpstravis-cicomisaquediasmredux-tracking-middlewaresvgbranchmaster-altbuild-status)
  - [Instalation](#instalation)
  - [Setup](#setup)
  - [Filtering event types](#filtering-event-types)
  - [Customising event types](#customising-event-types)
  - [Combining multiple trackers](#combining-multiple-trackers)
  - [Accessing the redux state](#accessing-the-redux-state)
  - [API Specification](#api-specification)
    - [Settings object](#settings-object)
    - [trackingMiddleware(trackers)](#trackingmiddlewaretrackers)
  - [Versioning](#versioning)
  - [Contributing](#contributing)
  - [History](#history)
  - [License](#license)

## Instalation

```
yarn add redux-tracking-middleware
```

## Setup

Import the middleware, write your configurations and include it in `applyMiddleware` when creating a Redux Store:

```js
import trackingMiddleware from 'redux-tracking-middleware'
import mixpanel from 'mixpanel'

const defaultTracking = {
  track: action => {
    mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware(defaultTrack)
const store = createStore(rootReducer, applyMiddleware(tracking))
```

## Filtering event types

The property `pattern` of the options object, which accepts a regex or a function allows you to filter in or out certain action types based on your own rules.

```js
const defaultTrack = {
  pattern: action => !action.type.includes('FAILED'), // all actions except failed
  track: action => {
    mixpanel.track(action.type, action.payload)
  }
}
```

```js
const defaultTracking = {
  // all actions where allowTracking is true,
  pattern: action => action.allowTracking === true,
  track: action => {
    mixpanel.track(action.type, action.payload)
  }
}
```

## Customising event types

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
const store = createStore(rootReducer, applyMiddleware(tracking))
```

## Combining multiple trackers

The tracking middleware works as a left-to-right pipe, which means that every function will be executed and its output will serve as input to the next function. Nevertheless, the pipe will be interrupted whenever a `track` function is invoked.

```js
const userTracking = {
  pattern: `USER_LOGGED_IN`,
  transform: action => {
    return {
      ...action,
      type: 'User Logged In' // transforms the action type and pass it along
    }
  }
}

const defaultTracking = {
  // pipe will be interrupted here
  track: action => {
    Mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware([userTracking, defaultTracking])
const store = createStore(rootReducer, applyMiddleware(tracking))
```

When you include a `track` function before the last method in the pipe, it would get interrupted in the same way.

```js
const apiErrorTracking = {
  pattern: action => action.type.includes('FAILED'), // catches all failed actions
  // pipe will be interrupted here
  track: action => {
    Sentry.captureException(action.error)
  }
}

const defaultTracking = {
  // this won't get executed
  track: action => {
    Mixpanel.track(action.type, action.payload)
  }
}

const tracking = trackingMiddleware([userTracking, defaultTracking])
const store = createStore(rootReducer, applyMiddleware(tracking))
```

## Accessing the redux state

```js
import trackingMiddleware from 'redux-tracking-middleware'

// catches the user information and add it to every action
const getUser = {
  transform: (action, getState) => {
    const user = getState().userReducer.user

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
const store = createStore(rootReducer, applyMiddleware(tracking))
```

## API Specification

### Settings object

| Property  | Description                                                   | Type                       | Default |
| --------- | ------------------------------------------------------------- | -------------------------- | ------- |
| pattern   | Determine which actions should be tracked                     | RegEx or Function          | `*`     |
| track     | Callback function called when action is finally tracked       | Function(action, getState) |
| transform | Modify the action object before it reaches the `track` method | Function(action, getState) |

### trackingMiddleware(trackers)

| Argument | Description                        | Type  | Default |
| -------- | ---------------------------------- | ----- | ------- |
| trackers | Methods to be included in the pipe | Array |

## Versioning

To keep better organization of releases we follow the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## Contributing

Find on our [roadmap](https://github.com/isaquediasm/redux-tracking-middleware/issues/1) the next steps of the project ;)
<br>
Want to contribute? [Follow these recommendations](https://github.com/isaquediasm/redux-tracking-middleware/blob/master/CONTRIBUTING.md).

## History

See [Releases](https://github.com/isaquediasm/redux-tracking-middleware/releases) for detailed changelog.

## License

[MIT License](https://github.com/isaquediasm/redux-tracking-middleware/master/LICENSE.md) © [Isaque Dias](https://github.com/isaquediasm)
